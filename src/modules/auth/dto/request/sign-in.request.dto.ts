import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ example: 'blog@five.com OR +380673456789' })
  @IsNotEmpty()
  @IsString()
  readonly emailOrPhone: string;

  @ApiProperty({ example: 'Five555$$$' })
  @IsNotEmpty()
  @IsString()
  password?: string;
}
