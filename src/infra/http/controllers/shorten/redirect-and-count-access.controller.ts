import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { RedirectAndCountAccessShortUrlUseCase } from '@/domain/url/application/use-cases/redirect-and-count-access-short-url';
import type { Response } from 'express';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Public } from '@/infra/auth/public';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('shorten')
@Controller('/:short')
@Public()
export class RedirectAndCountAccessController {
  constructor(
    private redirectAndCountAccess: RedirectAndCountAccessShortUrlUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Redirect from original url',
    description: 'Redirect the original url',
  })
  @ApiResponse({
    status: 302,
  })
  @HttpCode(302)
  async handle(@Param('short') short: string, @Res() res: Response) {
    const result = await this.redirectAndCountAccess.execute({
      shortUrl: short,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const originalUrl = result.value.originalUrl.value;

    return res.redirect(302, originalUrl);
  }
}
