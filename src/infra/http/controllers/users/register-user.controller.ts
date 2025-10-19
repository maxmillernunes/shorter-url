import { z } from 'zod';
import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/user/application/use-cases/errors/user-already-exists-error';

const registerBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller('/users')
export class RegisterController {
  constructor(private registerStudent: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async handle(@Body() body: RegisterBodySchema) {
    const { email, password } = body;

    const result = await this.registerStudent.execute({
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
