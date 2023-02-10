import {
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Match } from '@shared/decorators';
import { minLengthAuthValidation } from '@shared/common/constants';

export class SignUpRequestDto {
  @ApiPropertyOptional({ example: 'Blog Test' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Blog' })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ example: '+380673456789' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ example: 'blog@five.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Five555$$$' })
  @IsNotEmpty()
  @MinLength(minLengthAuthValidation)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ example: 'Five555$$$' })
  @MinLength(minLengthAuthValidation)
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}

export class OauthSignUpRequestDto extends OmitType(SignUpRequestDto, [
  'phone',
  'password',
  'passwordConfirm',
] as const) {}
