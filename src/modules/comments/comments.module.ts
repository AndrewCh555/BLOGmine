import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtStrategy } from '@shared/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentRepository } from '@shared/repositories/comment.repository';
import { Comment } from '@shared/models/comment.model';
import { UserModule } from '@modules/user/user.module';
import { UserCommentLikes } from '@shared/models/likes/usercomment.likes.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, UserCommentLikes]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'a1b2c3d4e5f6',
      signOptions: {
        expiresIn: process.env.EXPIRE_TIME,
      },
    }),
    UserModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository, JwtStrategy],
})
export class CommentsModule {}
