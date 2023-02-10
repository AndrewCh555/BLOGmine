import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  likesCount: number;

  @ApiProperty()
  @Expose()
  postId: string;

  @ApiProperty()
  @Expose()
  authorId: string;

  @ApiProperty()
  @Expose()
  createdAt: string;
}
