import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { UrlFactory } from '@test/factories/make-short-url';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from '@test/factories/make-user';

describe('Fetch Short URL By User By ID (E2E)', () => {
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

  test('[GET] /my-urls', async () => {
    const user = await userFactory.makePrismaUser();
    const url = await urlFactory.makePrismaUrl({ userId: user.id });

    const token = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/my-urls`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      short_urls: expect.arrayContaining([
        expect.objectContaining({
          originalUrl: url.originalUrl.value,
        }),
      ]),
    });
  });
});
