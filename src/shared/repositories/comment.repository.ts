import { CreateCommentRequestDto } from '@modules/comments/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '@shared/models/comment.model';
import { UserCommentLikes } from '@shared/models/likes/usercomment.likes.model';
import { User } from '@shared/models/user.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment)
    private readonly comment: typeof Comment,
    @InjectModel(UserCommentLikes)
    private readonly commentLikes: typeof UserCommentLikes,
  ) {}

  async findOneById(id: string): Promise<Comment> {
    return await this.comment.findOne({
      where: { id },
      nest: true,
    });
  }

  async findAllForPost(postId: string): Promise<Comment[]> {
    return await this.comment.findAll({ where: { postId } });
  }

  async likeComment(likedCommentId: string, userId: string) {
    const didUserAlreadyLike = !!(await this.commentLikes.findOne({
      where: { userId, likedCommentId },
    }));
    if (didUserAlreadyLike) {
      return await this.commentLikes.destroy({
        where: { userId, likedCommentId },
      });
    }
    return await this.commentLikes.create({ userId, likedCommentId });
  }

  async getLikesUsers(id: string) {
    const comment = await this.comment.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'likes',
          through: { attributes: [] },
        },
      ],
      nest: true,
    });

    return comment.likes;
  }

  async create(
    dto: CreateCommentRequestDto,
    postId: string,
    authorId: string,
  ): Promise<Comment> {
    return await this.comment.create({ ...dto, postId, authorId });
  }

  async delete(id: string): Promise<void> {
    await this.comment.destroy({
      where: { id },
    });
  }
}
