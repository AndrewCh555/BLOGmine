import { StorageService } from '@modules/storage/storage.service';
import { UserService } from '@modules/user/user.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RawFileDataType } from '@shared/common';
import { CommonErrorTypes } from '@shared/common/errormessages-common/commonerrors';
import { UserJwtPayload } from '@shared/common/interface/user-jwt-payload.interface';
import { PostImage } from '@shared/models/images/postImage.model';
import { PostImageRepository } from '@shared/repositories/images/postimage.repository';
import { PostRepository } from '@shared/repositories/post.repository';
import { CreatePostRequestDto, UpdatePostRequestDto } from './dto/request';

@Injectable()
export class FeedService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly imageRepository: PostImageRepository,
  ) {}

  async createPost(
    createPostDto: CreatePostRequestDto,
    images: RawFileDataType[],
    author: UserJwtPayload,
  ) {
    const authorId = (await this.userService.findByEmailOrPhone(author.email))
      .id;
    const newPost = await this.postRepository.create(createPostDto, authorId);

    if (images) await this.savePostImages(images, newPost.id);

    return await this.postRepository.findOneById(newPost.id);
  }

  findAllPosts() {
    return this.postRepository.findAll();
  }

  findAllPostsForUser(userId: string) {
    return this.postRepository.findAllForUser(userId);
  }

  findPostsByCaptionWords(caption: string) {
    return this.postRepository.findByCaptionWords(caption);
  }

  findPostsByTag(tag: string) {
    return this.postRepository.findByTag(tag);
  }

  async likePost(postId: string, user: UserJwtPayload) {
    const userId = (await this.userService.findByEmailOrPhone(user.email)).id;
    await this.postRepository.likePost(postId, userId);
  }

  getPostLikesUsers(postId: string) {
    return this.postRepository.getLikesUsers(postId);
  }

  findPostById(id: string) {
    return this.postRepository.findOneById(id);
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostRequestDto,
    user: UserJwtPayload,
    newImages?: RawFileDataType[] | undefined,
  ) {
    await this.checkUserPermission(user, id);

    if (newImages && !!newImages.length) {
      await this.cleanupPostImages(id);
      await this.savePostImages(newImages, id);
    }

    return this.postRepository.update(id, updatePostDto);
  }

  async removePost(id: string, user: UserJwtPayload) {
    await this.checkUserPermission(user, id);

    await this.cleanupPostImages(id);
    return this.postRepository.delete(id);
  }

  async savePostImages(
    images: RawFileDataType[],
    postId: string,
  ): Promise<PostImage[]> {
    const storageImages = await Promise.all(
      images.map(async (image) => await this.storageService.saveFile(image)),
    );

    return await Promise.all(
      storageImages.map((image) => this.imageRepository.save(image, postId)),
    );
  }

  async cleanupPostImages(postId: string): Promise<number> {
    return await this.imageRepository.deleteForPost(postId);
  }

  async checkUserPermission(user: UserJwtPayload, postId: string) {
    const userId = (await this.userService.findByEmailOrPhone(user.email)).id;
    const postToChange = await this.findPostById(postId);

    if (!!!postToChange)
      throw new NotFoundException(CommonErrorTypes.RESOURCE_NOT_FOUND);

    if (postToChange.authorId !== userId) throw new ForbiddenException();
  }
}
