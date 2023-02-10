import { StorageService } from '@modules/storage/storage.service';
import {
  BeforeDestroy,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Post } from '../post.model';

@Table({ tableName: 'postimages' })
export class PostImage extends Model<PostImage> {
  private static readonly storageService: StorageService = new StorageService();

  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  imageName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  mediaLink?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fileId?: string;

  @BelongsTo(() => Post)
  originalPost: Post;
  @ForeignKey(() => Post)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  postId: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  static async cleanupPostImage(postImage: PostImage) {
    return await this.storageService.deleteFile(postImage.url);
  }

  @BeforeDestroy
  static async beforePostImageDeletion(postImage: PostImage) {
    await this.cleanupPostImage(postImage);
  }
}
