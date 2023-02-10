import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'blog@five.com OR +380673456789' })
  @IsNotEmpty()
  @IsString()
  readonly emailOrPhone: string;
}
