import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SignUpRequestDto } from '@modules/auth/dto';
import { IsOptional } from 'class-validator';

export class UpdateUserRequestDto extends PartialType(SignUpRequestDto) {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  currentHashedRefreshToken?: string;

  @ApiPropertyOptional({ type: 'file' })
  @IsOptional()
  newAvatar?: Express.Multer.File;

  @ApiPropertyOptional({ type: 'file' })
  @IsOptional()
  newWallpaper?: Express.Multer.File;
}
