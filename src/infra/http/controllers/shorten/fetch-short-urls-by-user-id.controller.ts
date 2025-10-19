import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { FetchUrlsByUserIdUseCase } from '@/domain/url/application/use-cases/fetch-urls-by-user-id';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

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
  async handle(
    @Query('page', QueryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user?.sub;

    const urls = await this.fetchShortUrlsByUserId.execute({
      userId,
      page,
    });

    return urls;
  }
}
