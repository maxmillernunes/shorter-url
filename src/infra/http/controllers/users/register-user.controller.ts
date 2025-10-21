import { z } from 'zod';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/user/application/use-cases/errors/user-already-exists-error';
import { Public } from '@/infra/auth/public';

const registerBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(registerBodySchema);

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller('/users')
@Public()
export class RegisterController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
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
