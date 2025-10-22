import { z } from 'zod';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/user/application/use-cases/errors/user-already-exists-error';
import { Public } from '@/infra/auth/public';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

const registerBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(registerBodySchema);

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

class RegisterBodySchemaDto extends createZodDto(registerBodySchema) {}

@ApiTags('users')
@Controller('/users')
@Public()
export class RegisterController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @ApiBody({ type: RegisterBodySchemaDto, description: 'Create account' })
  @ApiResponse({
    status: 201,
  })
  @ApiOperation({
    summary: 'Create account from user',
    description: 'Create a account from user',
  })
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterBodySchema) {
    const { email, password } = body;

    const result = await this.registerUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UserAlreadyExistsError:
            throw new ConflictException(error.message);

          default:
            throw new BadRequestException(error.message);
        }
      }
    }
  }
}
