import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { FetchUrlsByUserIdUseCase } from '@/domain/url/application/use-cases/fetch-urls-by-user-id';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { UrlPresenter } from '../../presenters/url-presenter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const fetchShortUrlResponseSchema = z.object({
  short_urls: z.array(
    z.object({
      id: z.uuid(),
      userId: z.uuid(),
      originalUrl: z.url(),
      slug: z.string(),
      alias: z.string(),
      accessCounter: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

const QueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

class FetchShortUrlResponseSchema extends createZodDto(
  fetchShortUrlResponseSchema,
) {}

@ApiTags('shorten')
@ApiBearerAuth('jwt-auth')
@Controller('/my-urls')
export class FetchShortUrlsByUserIdController {
  constructor(private fetchShortUrlsByUserId: FetchUrlsByUserIdUseCase) {}

  @Get()
  @ApiResponse({
    type: FetchShortUrlResponseSchema,
    status: 200,
  })
  @ApiOperation({
    summary: 'Fetch the all short url that associate a user',
    description: 'Fetch the all short url that associate a user paginated',
  })
  @HttpCode(200)
  async handle(
    @Query('page', QueryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user?.sub;

    const result = await this.fetchShortUrlsByUserId.execute({
      userId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const urls = result.value.urls;

    return { short_urls: urls.map(UrlPresenter.toHTTP) };
  }
}
