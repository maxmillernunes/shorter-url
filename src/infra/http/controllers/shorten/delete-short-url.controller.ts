import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteShortUrlUseCase } from '@/domain/url/application/use-cases/delete-short-url';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('shorten')
@ApiBearerAuth('jwt-auth')
@Controller('/my-urls/:id')
export class DeleteShortUrlController {
  constructor(private deleteShortUrl: DeleteShortUrlUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Delete a short url',
    description: 'Delete the short url that associate a user',
  })
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteShortUrl.execute({
      id,
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
  }
}
