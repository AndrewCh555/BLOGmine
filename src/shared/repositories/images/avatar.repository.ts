import { InjectModel } from '@nestjs/sequelize';
import { StorageFileType } from '@shared/common';
import { Avatar } from '@shared/models/images/avatar.model';

export class AvatarRepository {
  constructor(
    @InjectModel(Avatar)
    private readonly avatar: typeof Avatar,
  ) {}

  async save(dto: StorageFileType, userId: string): Promise<Avatar> {
    return await this.avatar.create({ ...dto, userId });
  }

  async deleteForUserId(userId: string): Promise<number> {
    return await this.avatar.destroy({
      where: { userId },
      individualHooks: true,
    });
  }
}
