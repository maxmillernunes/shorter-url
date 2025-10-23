import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import { UpdateOriginalUrlUseCase } from '@/domain/url/application/use-cases/update-original-url';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseBadRequestDefault } from '../default-errors/bad-request-error';

const updateOriginalUrlBodySchema = z.object({
  originalUrl: z.url(),
});

const bodyValidationPipe = new ZodValidationPipe(updateOriginalUrlBodySchema);

type UpdateOriginalUrlBodySchema = z.infer<typeof updateOriginalUrlBodySchema>;

@ApiTags('shorten')
@ApiBearerAuth('jwt-auth')
@Controller('/my-urls/:id')
export class UpdateOriginalUrlController {
  constructor(private updateOriginalUrl: UpdateOriginalUrlUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Update the original url',
    description: 'Update only the original url from a short url',
  })
  @ApiResponse({
    status: 204,
    description: 'Updated',
  })
  @ApiResponse({
    status: 400,
    type: ResponseBadRequestDefault,
  })
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateOriginalUrlBodySchema,
    @Param('id') id: string,
  ) {
    const { originalUrl } = body;

    const result = await this.updateOriginalUrl.execute({
      id,
      newOriginalUrl: originalUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }
  }
}
