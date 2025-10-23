import { ApiProperty } from '@nestjs/swagger';

export class ResponseBadRequestDefault {
  @ApiProperty({
    example: 'Bad Request Message',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
