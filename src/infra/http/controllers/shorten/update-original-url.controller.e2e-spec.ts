import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { UrlFactory } from '@test/factories/make-short-url';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from '@test/factories/make-user';

describe('Update Original URL (E2E)', () => {
  let app: INestApplication;
  let urlFactory: UrlFactory;
  let jwt: JwtService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UrlFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    urlFactory = moduleRef.get(UrlFactory);
    jwt = moduleRef.get<JwtService>(JwtService);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[PUT] /my-urls/:id', async () => {
    const user = await userFactory.makePrismaUser();
    const url = await urlFactory.makePrismaUrl({ userId: user.id });

    const token = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/my-urls/${url.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'http://localhost:3333',
      });

    expect(response.status).toBe(204);
  });
});
