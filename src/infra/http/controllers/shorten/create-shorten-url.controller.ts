import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CreateShortUrlUseCase } from '@/domain/url/application/use-cases/create-short-url';
import z from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { Public } from '@/infra/auth/public';

const createShortUrlBodySchema = z.object({
  originalUrl: z.url(),
  alias: z.string().min(3).max(30).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(createShortUrlBodySchema);

type CreateShortUrlBodySchema = z.infer<typeof createShortUrlBodySchema>;

@Controller('/shorten')
@Public()
export class CreateShortUrlController {
  constructor(private createShortUrl: CreateShortUrlUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateShortUrlBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user?.sub;
    const { alias, originalUrl } = body;

    await this.createShortUrl.execute({
      userId,
      alias,
      originalUrl,
    });
  }
}
