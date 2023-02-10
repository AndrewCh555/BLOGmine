import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OauthUserInfoResponseDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'test@gmail.com',
  })
  @Expose()
  email: string;
}
