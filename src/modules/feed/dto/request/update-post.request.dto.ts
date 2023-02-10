import { PartialType } from '@nestjs/swagger';
import { CreatePostRequestDto } from './create-post.request.dto';

export class UpdatePostRequestDto extends PartialType(CreatePostRequestDto) {}
