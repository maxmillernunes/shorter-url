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

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

const authenticateResponseSchema = z.object({
  access_token: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

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
  @ApiBody({
    type: AuthenticateBodySchemaDto,
    description: 'Login on the app',
  })
  @ApiResponse({
    type: AuthenticateResponseSchema,
    status: 200,
  })
  @ApiOperation({
    summary: 'Authenticate user after register',
    description: 'Authenticate user',
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
