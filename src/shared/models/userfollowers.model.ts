import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_followers', timestamps: false })
export class UserFollowers extends Model<UserFollowers> {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => User)
  @Column
  followerId: string;
}
