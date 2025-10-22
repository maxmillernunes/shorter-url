import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import { InvalidOriginalUrlError } from '@/domain/url/enterprise/entities/value-objects/errors/invalid-original-url-error';
import { OriginalUrlTooLongError } from '@/domain/url/enterprise/entities/value-objects/errors/original-url-too-long-error';
import { UpdateOriginalUrlUseCase } from '@/domain/url/application/use-cases/update-original-url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);

        case InvalidOriginalUrlError:
          throw new BadRequestException(error.message);

        case OriginalUrlTooLongError:
          throw new BadRequestException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
