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

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const QueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/my-urls')
export class FetchShortUrlsByUserIdController {
  constructor(private fetchShortUrlsByUserId: FetchUrlsByUserIdUseCase) {}

  @Get()
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

    return { shortUrls: urls.map(UrlPresenter.toHTTP) };
  }
}
