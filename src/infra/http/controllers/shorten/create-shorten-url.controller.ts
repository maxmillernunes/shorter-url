import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CreateShortUrlUseCase } from '@/domain/url/application/use-cases/create-short-url';
import z from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { UserNotAuthenticatedError } from '@/domain/url/application/use-cases/errors/user-not-authenticated-error';
import { SlugAlreadyExistsError } from '@/domain/url/application/use-cases/errors/slug-already-exists-error';
import { AliasRegexRulesError } from '@/domain/url/enterprise/entities/value-objects/errors/alias-regex-rules-error';
import { ReservedPathsAliasError } from '@/domain/url/enterprise/entities/value-objects/errors/reserved-paths-alias-error';
import { InvalidOriginalUrlError } from '@/domain/url/enterprise/entities/value-objects/errors/invalid-original-url-error';
import { OriginalUrlTooLongError } from '@/domain/url/enterprise/entities/value-objects/errors/original-url-too-long-error';
import { OptionalAuth } from '@/infra/auth/optional-auth';

const createShortUrlBodySchema = z.object({
  originalUrl: z.url(),
  alias: z.string().min(3).max(30).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(createShortUrlBodySchema);

type CreateShortUrlBodySchema = z.infer<typeof createShortUrlBodySchema>;

@Controller('/shorten')
@OptionalAuth()
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

    console.log({
      userId,
      alias,
      originalUrl,
    });

    const result = await this.createShortUrl.execute({
      userId,
      alias,
      originalUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotAuthenticatedError:
          throw new UnauthorizedException(error.message);

        case SlugAlreadyExistsError:
          throw new ConflictException(error.message);

        case AliasRegexRulesError:
          throw new BadRequestException(error.message);

        case ReservedPathsAliasError:
          throw new BadRequestException(error.message);

        case InvalidOriginalUrlError:
          throw new BadRequestException(error.message);

        case OriginalUrlTooLongError:
          throw new BadRequestException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
