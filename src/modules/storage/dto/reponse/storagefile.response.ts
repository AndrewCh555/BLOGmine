import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StorageFileResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  imageName: string;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  mediaLink: string;

  @ApiProperty()
  @Expose()
  size: number;

  @ApiProperty()
  @Expose()
  fileId: string;
}
