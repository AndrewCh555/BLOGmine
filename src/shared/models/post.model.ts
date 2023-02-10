import {
  AfterFind,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Comment } from './comment.model';
import { User } from './user.model';
import { UserPostLikes } from './likes/userpost.likes.model';
import { PostImage } from './images/postImage.model';

@Table({ tableName: 'posts' })
export class Post extends Model<Post> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: false, defaultValue: '' })
  caption: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  tags: string[];

  @BelongsTo(() => User, 'authorId')
  author: User;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  authorId: string;

  @HasMany(() => PostImage)
  postImages: PostImage[];

  @HasMany(() => Comment)
  comments: Comment[];
  @Column({ type: DataType.VIRTUAL(DataType.NUMBER) })
  commentsCount: number;

  @BelongsToMany(() => User, () => UserPostLikes)
  likes: User[];
  @Column({ type: DataType.VIRTUAL(DataType.NUMBER) })
  likesCount: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  static async setInstanceLikesCount(posts: Post[]) {
    await Promise.all(
      posts.map(
        async (post) =>
          (post.likesCount = await UserPostLikes.count({
            where: { likedPostId: post.id },
          })),
      ),
    );
  }
  static async setPostCommentsCount(posts: Post[]) {
    await Promise.all(
      posts.map(
        async (post) =>
          (post.commentsCount = await Comment.count({
            where: { postId: post.id },
          })),
      ),
    );
  }

  @AfterFind
  static async afterPostFind(posts: Post | Post[]) {
    if (!Array.isArray(posts)) posts = [posts];

    await this.setInstanceLikesCount(posts);
    await this.setPostCommentsCount(posts);
    await Promise.all(
      posts.map(
        async (post: Post) =>
          await Comment.setInstanceLikesCount(post.comments || []),
      ),
    );
  }
}
