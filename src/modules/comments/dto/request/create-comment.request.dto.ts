import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentRequestDto {
  @ApiProperty({ example: 'New comment' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
