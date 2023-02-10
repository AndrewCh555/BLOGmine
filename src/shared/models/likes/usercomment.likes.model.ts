import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Comment } from '../comment.model';
import { User } from '../user.model';

@Table({ tableName: 'usercomment_likes', updatedAt: false })
export class UserCommentLikes extends Model<UserCommentLikes> {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Comment)
  @Column
  likedCommentId: string;
}
