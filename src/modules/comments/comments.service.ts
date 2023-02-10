import { UserService } from '@modules/user/user.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonErrorTypes } from '@shared/common/errormessages-common/commonerrors';
import { UserJwtPayload } from '@shared/common/interface/user-jwt-payload.interface';
import { CommentRepository } from '@shared/repositories/comment.repository';
import { CreateCommentRequestDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentRequestDto,
    postId: string,
    author: UserJwtPayload,
  ) {
    const authorId = (await this.userService.findByEmailOrPhone(author.email))
      .id;
    return this.commentRepository.create(createCommentDto, postId, authorId);
  }

  findAllCommentsForPost(postId: string) {
    return this.commentRepository.findAllForPost(postId);
  }

  async likeComment(commentId: string, user: UserJwtPayload) {
    const userId = (await this.userService.findByEmailOrPhone(user.email)).id;
    await this.commentRepository.likeComment(commentId, userId);
  }

  getCommentLikesUsers(commentId: string) {
    return this.commentRepository.getLikesUsers(commentId);
  }

  findCommentById(id: string) {
    return this.commentRepository.findOneById(id);
  }

  async removeComment(id: string, user: UserJwtPayload) {
    const userId = (await this.userService.findByEmailOrPhone(user.email)).id;
    const commentToDelete = await this.findCommentById(id);

    if (!!!commentToDelete)
      throw new NotFoundException(CommonErrorTypes.RESOURCE_NOT_FOUND);

    if (commentToDelete.authorId !== userId)
      throw new ForbiddenException(CommonErrorTypes.DELETION_FORBIDDEN);
    return this.commentRepository.delete(id);
  }
}
