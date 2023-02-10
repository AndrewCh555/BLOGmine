import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'User full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+380636479067' })
  @IsPhoneNumber()
  phone?: string;
}
