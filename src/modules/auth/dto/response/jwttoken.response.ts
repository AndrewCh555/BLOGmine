import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class JwtTokenResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UifQ.DjwRE2jZhren2Wt37t5hlVru6Myq4AhpGLiiefF69u8',
  })
  @Expose()
  token: string;
}
