import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Post } from '../post.model';
import { User } from '../user.model';

@Table({ tableName: 'userpost_likes', updatedAt: false })
export class UserPostLikes extends Model<UserPostLikes> {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Post)
  @Column
  likedPostId: string;
}
