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
import { OptionalAuth } from '@/infra/auth/optional-auth';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { EnvService } from '@/infra/env/env.service';
import { UrlPresenter } from '../../presenters/url-presenter';
import {
  ResponseAliasRegexRulesError,
  ResponseInvalidOriginalUrlError,
  ResponseOriginalUrlTooLongError,
  ResponseReservedPathsAliasError,
  ResponseSlugAlreadyExistsError,
  ResponseUserNotAuthenticatedError,
} from './errors/shorten-errors-schema';

const createShortUrlBodySchema = z.object({
  originalUrl: z.url(),
  alias: z.string().min(3).max(30).optional(),
});

const createShortUrlResponseSchema = z.object({
  short_url: z.url(),
});

const bodyValidationPipe = new ZodValidationPipe(createShortUrlBodySchema);

type CreateShortUrlBodySchema = z.infer<typeof createShortUrlBodySchema>;

class CreateShortUrlBodySchemaDto extends createZodDto(
  createShortUrlBodySchema,
) {}
class CreateShortUrlResponseSchema extends createZodDto(
  createShortUrlResponseSchema,
) {}

@ApiTags('shorten')
@ApiBearerAuth('jwt-auth')
@Controller('/shorten')
@OptionalAuth()
export class CreateShortUrlController {
  constructor(
    private createShortUrl: CreateShortUrlUseCase,
    private env: EnvService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new short url',
    description: 'The auth token is optional',
  })
  @ApiBody({
    type: CreateShortUrlBodySchemaDto,
    description: 'Login on the app',
  })
  @ApiResponse({
    type: CreateShortUrlResponseSchema,
    status: 200,
  })
  @ApiResponse({
    status: 401,
    type: ResponseUserNotAuthenticatedError,
  })
  @ApiResponse({
    status: 409,
    type: ResponseSlugAlreadyExistsError,
  })
  @ApiExtraModels(
    ResponseAliasRegexRulesError,
    ResponseReservedPathsAliasError,
    ResponseInvalidOriginalUrlError,
    ResponseOriginalUrlTooLongError,
  )
  @ApiResponse({
    status: 400,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ResponseAliasRegexRulesError) },
        { $ref: getSchemaPath(ResponseReservedPathsAliasError) },
        { $ref: getSchemaPath(ResponseInvalidOriginalUrlError) },
        { $ref: getSchemaPath(ResponseOriginalUrlTooLongError) },
      ],
    },
  })
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: CreateShortUrlBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user?.sub;
    const { alias, originalUrl } = body;

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

        default:
          throw new BadRequestException(error.message);
      }
    }

    const url = result.value.url;

    const urlFormatted = UrlPresenter.toHTTP(url);

    const formattedUrl = `${this.env.get('BASE_URL')}:${this.env.get('PORT')}/${urlFormatted.alias ? urlFormatted.alias : urlFormatted.slug}`;

    return {
      short_url: formattedUrl,
    };
  }
}
