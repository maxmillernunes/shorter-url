import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';
import { WrongCredentialsError } from '@/domain/user/application/use-cases/errors/wrong-credentials-error';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ErrorResponseSchema401 } from './auth-errors-schema';
import { ResponseBadRequestDefault } from '../default-errors/bad-request-error';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

const authenticateResponseSchema = z.object({
  access_token: z.string(),
});

class AuthenticateBodySchemaDto extends createZodDto(authenticateBodySchema) {}
class AuthenticateResponseSchema extends createZodDto(
  authenticateResponseSchema,
) {}

@ApiTags('auth')
@Controller('/auth/login')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Authenticate user after register',
    description: 'Authenticate user',
  })
  @ApiBody({
    type: AuthenticateBodySchemaDto,
    description: 'Login on the app',
  })
  @ApiResponse({
    type: AuthenticateResponseSchema,
    status: 200,
  })
  @ApiResponse({
    type: ErrorResponseSchema401,
    status: 401,
  })
  @ApiResponse({
    type: ResponseBadRequestDefault,
    status: 400,
  })
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
