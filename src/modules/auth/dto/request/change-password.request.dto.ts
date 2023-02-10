import { IsNotEmpty, MinLength, Matches, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@shared/decorators';
import { minLengthAuthValidation } from '@shared/common/constants';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'blog@five.com OR +380673456789' })
  @IsString()
  @IsNotEmpty()
  readonly emailOrPhone: string;

  @ApiProperty({ example: 'Five555$$$' })
  @IsString()
  @IsNotEmpty()
  @MinLength(minLengthAuthValidation)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ example: 'Five555$$$' })
  @IsString()
  @IsNotEmpty()
  @MinLength(minLengthAuthValidation)
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
