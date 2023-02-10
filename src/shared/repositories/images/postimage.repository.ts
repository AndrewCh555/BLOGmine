import { InjectModel } from '@nestjs/sequelize';
import { StorageFileType } from '@shared/common';
import { PostImage } from '@shared/models/images/postImage.model';

export class PostImageRepository {
  constructor(
    @InjectModel(PostImage)
    private readonly postImage: typeof PostImage,
  ) {}

  async save(dto: StorageFileType, postId: string): Promise<PostImage> {
    return await this.postImage.create({ ...dto, postId });
  }

  async deleteForPost(postId: string): Promise<number> {
    return await this.postImage.destroy({
      where: { postId },
      individualHooks: true,
    });
  }
}
