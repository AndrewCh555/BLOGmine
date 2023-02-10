import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';

import { User } from '@shared/models/user.model';
import { StorageFileResponseDto } from '@modules/storage/dto';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  avatar: StorageFileResponseDto;

  @ApiProperty()
  @Expose()
  profileWallpaper: StorageFileResponseDto;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  followersCount: number;

  @ApiProperty()
  @Expose()
  followingCount: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  public static mapFrom(data: User): UserResponseDto {
    return plainToClass(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
