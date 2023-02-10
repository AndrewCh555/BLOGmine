import { InjectModel } from '@nestjs/sequelize';
import {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from '@modules/feed/dto/request';
import { Post } from '@shared/models/post.model';
import { Comment } from '@shared/models/comment.model';
import { Op } from 'sequelize';
import { User } from '@shared/models/user.model';
import { UserPostLikes } from '@shared/models/likes/userpost.likes.model';
import { PostImage } from '@shared/models/images/postImage.model';

export class PostRepository {
  constructor(
    @InjectModel(Post)
    private readonly post: typeof Post,
    @InjectModel(UserPostLikes)
    private readonly postLikes: typeof UserPostLikes,
  ) {}

  async findOneById(id: string): Promise<Post> {
    return await this.post.findOne({
      where: { id },
      include: [Comment, PostImage],
      nest: true,
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.post.findAll({});
  }

  async findAllForUser(userId: string) {
    return await this.post.findAll({
      where: { authorId: userId },
      include: [PostImage],
    });
  }

  async findByCaptionWords(caption: string) {
    return await this.post.findAll({
      where: {
        caption: { [Op.iRegexp]: `.*((?<![\\w])${caption}(?![\\w])).*` },
      },
      include: [PostImage],
      nest: true,
    });
  }

  async findByTag(tag: string) {
    return await this.post.findAll({
      where: { tags: { [Op.contains]: [tag] } },
      include: [PostImage],
      nest: true,
    });
  }

  async likePost(likedPostId: string, userId: string) {
    const didUserAlreadyLike = !!(await this.postLikes.findOne({
      where: { userId, likedPostId },
    }));
    if (didUserAlreadyLike) {
      return await this.postLikes.destroy({
        where: { userId, likedPostId },
      });
    }
    return await this.postLikes.create({ userId, likedPostId });
  }

  async getLikesUsers(id: string) {
    const post = await this.post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'likes',
          through: { attributes: [] },
        },
      ],
      nest: true,
    });

    return post.likes;
  }

  async update(id: string, updatePostDto: UpdatePostRequestDto) {
    await this.post.update(updatePostDto, {
      where: { id },
    });
  }

  async create(dto: CreatePostRequestDto, authorId: string): Promise<Post> {
    return await this.post.create({ ...dto, authorId });
  }

  async delete(id: string): Promise<void> {
    await this.post.destroy({
      where: { id },
    });
  }
}
