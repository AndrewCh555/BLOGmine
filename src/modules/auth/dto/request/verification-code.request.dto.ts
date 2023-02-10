import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { minLengthAuthVerification } from '@common/constants';

export class VerificationCodeRequestDto {
  @ApiProperty({ example: 'blog@five.com OR +380673456789' })
  @IsNotEmpty()
  @IsString()
  readonly emailOrPhone: string;

  @ApiProperty({ example: '5555' })
  @IsNotEmpty()
  @IsString()
  @MinLength(minLengthAuthVerification)
  code: string;
}
