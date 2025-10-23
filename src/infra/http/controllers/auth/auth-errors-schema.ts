import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseSchema401 {
  @ApiProperty({ example: 'Wrong credentials provided.' })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
