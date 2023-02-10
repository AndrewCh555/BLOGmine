import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsArray, IsOptional } from 'class-validator';
export class CreatePostRequestDto {
  @ApiProperty({ example: 'My new post' })
  @IsString()
  caption: string;

  @ApiPropertyOptional({ type: ['file'] })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  tags?: string[];
}
