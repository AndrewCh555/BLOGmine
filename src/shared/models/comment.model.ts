import {
  AfterFind,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserCommentLikes } from './likes/usercomment.likes.model';
import { Post } from './post.model';
import { User } from './user.model';

@Table({ tableName: 'comments', updatedAt: false })
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  content: string;

  @BelongsTo(() => User, 'authorId')
  author: User;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  authorId: string;

  @BelongsTo(() => Post)
  post: Post;
  @ForeignKey(() => Post)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  postId: string;

  @BelongsToMany(() => User, () => UserCommentLikes)
  likes: User[];
  @Column({
    type: DataType.VIRTUAL(DataType.NUMBER),
  })
  likesCount: number;

  @CreatedAt
  @Column
  createdAt: Date;

  static async setInstanceLikesCount(comments: Comment[]) {
    return await Promise.all(
      comments.map(
        async (comment) =>
          (comment.likesCount = await UserCommentLikes.count({
            where: { likedCommentId: comment.id },
          })),
      ),
    );
  }

  @AfterFind
  static async afterCommentFind(comments: Comment | Comment[]) {
    if (!Array.isArray(comments)) comments = [comments];

    await this.setInstanceLikesCount(comments);
  }
}
