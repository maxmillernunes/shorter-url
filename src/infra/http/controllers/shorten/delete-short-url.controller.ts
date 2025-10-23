import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { DeleteShortUrlUseCase } from '@/domain/url/application/use-cases/delete-short-url';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseBadRequestDefault } from '../default-errors/bad-request-error';

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
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  @ApiResponse({
    status: 400,
    type: ResponseBadRequestDefault,
  })
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteShortUrl.execute({
      id,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }
  }
}
