import {
  AfterFind,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Post } from './post.model';
import { UserPostLikes } from './likes/userpost.likes.model';
import { UserCommentLikes } from './likes/usercomment.likes.model';
import { Exclude } from 'class-transformer';
import { Avatar } from './images/avatar.model';
import { ProfileWallpaper } from './images/profileWallpaper.model';
import { UserFollowers } from './userfollowers.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name?: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  email?: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  phone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  pinCode: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  changedPassword: boolean;

  @HasOne(() => Avatar)
  avatar: Avatar;

  @HasOne(() => ProfileWallpaper)
  profileWallpaper: ProfileWallpaper;

  @HasMany(() => Post)
  posts: Post[];
  @BelongsToMany(() => Post, () => UserPostLikes, 'postsLiked')
  postsLiked: Post[];

  @HasMany(() => Comment)
  comments: Comment[];
  @BelongsToMany(() => Comment, () => UserCommentLikes, 'commentsLiked')
  commentsLiked: Comment[];

  @BelongsToMany(() => User, () => UserFollowers, 'userId')
  followers: User[];
  @Column({ type: DataType.VIRTUAL(DataType.NUMBER) })
  followersCount: number;

  @BelongsToMany(() => User, () => UserFollowers, 'followerId')
  following: User[];
  @Column({ type: DataType.VIRTUAL(DataType.NUMBER) })
  followingCount: number;

  @Exclude()
  currentHashedRefreshToken?: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  static async setFollowersFollowingCount(users: User[]) {
    return await Promise.all(
      users.map(async (user) => {
        user.followersCount = await UserFollowers.count({
          where: { userId: user.id },
        });
        user.followingCount = await UserFollowers.count({
          where: { followerId: user.id },
        });

        return user;
      }),
    );
  }

  @AfterFind
  static async afterUserFind(users: User | User[]) {
    if (users) {
      if (!Array.isArray(users)) users = [users];

      await this.setFollowersFollowingCount(users);
      await Promise.all(
        users.map(async (user: User) => {
          await User.setFollowersFollowingCount(user.followers || []);
          await User.setFollowersFollowingCount(user.following || []);
        }),
      );
    }
  }
}
