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
import { User } from '../user.model';

@Table({ tableName: 'profilewallpapers' })
export class ProfileWallpaper extends Model<ProfileWallpaper> {
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

  @BelongsTo(() => User)
  user: User;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  static async cleanupProfileWallpaper(profileWallpaper: ProfileWallpaper) {
    return await this.storageService.deleteFile(profileWallpaper.url);
  }

  @BeforeDestroy
  static async beforeProfileWallpaperDeletion(
    profileWallpaper: ProfileWallpaper,
  ) {
    await this.cleanupProfileWallpaper(profileWallpaper);
  }
}
