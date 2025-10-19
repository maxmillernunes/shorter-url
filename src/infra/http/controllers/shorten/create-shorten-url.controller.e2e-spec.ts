import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { UrlFactory } from '@test/factories/make-short-url';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from '@test/factories/make-user';

describe('Create Shorten URL (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /shorten => With Auth', async () => {
    const user = await userFactory.makePrismaUser();

    const token = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'http://localhost:3333',
        alias: 'localhost',
      });

    expect(response.status).toBe(201);
  });

  test('[POST] /shorten => Without Auth', async () => {
    const response = await request(app.getHttpServer()).post('/shorten').send({
      originalUrl: 'http://localhost:3333',
    });

    expect(response.status).toBe(201);
  });
});
