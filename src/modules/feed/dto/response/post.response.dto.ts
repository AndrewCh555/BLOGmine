import { CommentResponseDto } from '@modules/comments/dto';
import { StorageFileResponseDto } from '@modules/storage/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  caption: string;

  @ApiProperty()
  @Expose()
  tags: string[];

  @ApiProperty()
  @Expose()
  authorId: string;

  @ApiProperty({ isArray: true })
  @Expose()
  postImages: StorageFileResponseDto;

  @ApiProperty()
  @Expose()
  likesCount: number;

  @ApiProperty()
  @Expose()
  commentsCount: number;

  @ApiPropertyOptional({ isArray: true })
  @Expose()
  comments?: CommentResponseDto;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;
}
