import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserAlreadyExistsError {
  @ApiProperty({ example: 'User already exists.' })
  message: string;

  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}
