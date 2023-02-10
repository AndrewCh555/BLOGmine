import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckUsernameExistsRequestDto {
  @ApiProperty({ example: 'Blog' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
