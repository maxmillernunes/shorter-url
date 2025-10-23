import { ApiProperty } from '@nestjs/swagger';

/**
 * Create controller errors
 */
export class ResponseUserNotAuthenticatedError {
  @ApiProperty({
    example: 'It is necessary to be authenticated to create custom slug',
  })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class ResponseSlugAlreadyExistsError {
  @ApiProperty({ example: 'Custom slug Already exists.' })
  message: string;

  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}

export class ResponseAliasRegexRulesError {
  @ApiProperty({
    example:
      'Short url invalid: use 3–30 characters alpha numeric separated with (-). Ex: my-site.',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class ResponseReservedPathsAliasError {
  @ApiProperty({ example: 'Short invalid.' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class ResponseInvalidOriginalUrlError {
  @ApiProperty({ example: 'Invalid original URL' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class ResponseOriginalUrlTooLongError {
  @ApiProperty({ example: 'Original URL too long' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

/**
 * Redirect controller errors
 */
export class ResponseResourceNotFoundError {
  @ApiProperty({ example: 'Resource not found' })
  message: string;

  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
