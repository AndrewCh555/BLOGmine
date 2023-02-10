import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@shared/models/user.model';
import { UserRepository } from '@shared/repositories/user.repository';
import { JwtStrategy } from '@shared/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from '@modules/storage/storage.module';
import { AvatarRepository } from '@shared/repositories/images/avatar.repository';
import { Avatar } from '@shared/models/images/avatar.model';
import { ProfileWallpaperRepository } from '@shared/repositories/images/profilewallpaper.repository';
import { ProfileWallpaper } from '@shared/models/images/profileWallpaper.model';
import { UserFollowers } from '@shared/models/userfollowers.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Avatar, ProfileWallpaper, UserFollowers]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'a1b2c3d4e5f6',
      signOptions: {
        expiresIn: process.env.EXPIRE_TIME,
      },
    }),
    StorageModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AvatarRepository,
    ProfileWallpaperRepository,
    JwtStrategy,
  ],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
