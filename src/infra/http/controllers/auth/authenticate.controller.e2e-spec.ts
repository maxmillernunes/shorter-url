import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { UserFactory } from '@test/factories/make-user';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /auth/login', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('password123', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
