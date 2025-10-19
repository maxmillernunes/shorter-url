import { Injectable } from '@nestjs/common';
import { left, right, type Either } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';

interface RegisterUserUseCaseRequest {
  email: string;
  password: string;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
