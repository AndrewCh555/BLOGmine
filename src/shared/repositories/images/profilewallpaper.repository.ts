import { InjectModel } from '@nestjs/sequelize';
import { StorageFileType } from '@shared/common';
import { ProfileWallpaper } from '@shared/models/images/profileWallpaper.model';

export class ProfileWallpaperRepository {
  constructor(
    @InjectModel(ProfileWallpaper)
    private readonly profileWallpaper: typeof ProfileWallpaper,
  ) {}

  async save(dto: StorageFileType, userId: string): Promise<ProfileWallpaper> {
    return await this.profileWallpaper.create({ ...dto, userId });
  }

  async deleteForUserId(userId: string): Promise<number> {
    return await this.profileWallpaper.destroy({
      where: { userId },
      individualHooks: true,
    });
  }
}
