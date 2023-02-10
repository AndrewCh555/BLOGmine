import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@shared/models/post.model';
import { PostRepository } from '@shared/repositories/post.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@shared/strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { UserPostLikes } from '@shared/models/likes/userpost.likes.model';
import { StorageModule } from '@modules/storage/storage.module';
import { PostImage } from '@shared/models/images/postImage.model';
import { PostImageRepository } from '@shared/repositories/images/postimage.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Post, UserPostLikes, PostImage]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'a1b2c3d4e5f6',
      signOptions: {
        expiresIn: process.env.EXPIRE_TIME,
      },
    }),
    UserModule,
    StorageModule,
  ],
  controllers: [FeedController],
  providers: [FeedService, PostRepository, PostImageRepository, JwtStrategy],
})
export class FeedModule {}
