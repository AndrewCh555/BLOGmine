import { UserResponseDto } from '@modules/user/dto/response';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Comment } from '@shared/models/comment.model';
import { User } from '@shared/models/user.model';
import { CommentsService } from './comments.service';
import { CommentResponseDto, CreateCommentRequestDto } from './dto';

@Controller('comments')
@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post/:postId')
  @ApiOperation({ description: 'Add new comment for post' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Created comment', type: CommentResponseDto })
  createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentRequestDto,
    @Request() req,
  ): Promise<Comment> {
    return this.commentsService.createComment(
      createCommentDto,
      postId,
      req.user,
    );
  }

  @Get('post/:postId')
  @ApiOperation({ description: 'Get all comments for post' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Array of all comments for specified post',
    type: CommentResponseDto,
    isArray: true,
  })
  findAllCommentsForPost(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentsService.findAllCommentsForPost(postId);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Like a comment' })
  likeComment(@Param('id') commentId: string, @Request() req): Promise<void> {
    return this.commentsService.likeComment(commentId, req.user);
  }

  @Get(':id/likes/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get users who liked this comment' })
  @ApiOkResponse({
    description: 'Array of all users who liked specified comment',
    type: UserResponseDto,
    isArray: true,
  })
  getCommentLikesUsers(@Param('id') commentId: string): Promise<User[]> {
    return this.commentsService.getCommentLikesUsers(commentId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get comment by id' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Comment with specified id',
    type: CommentResponseDto,
  })
  findCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findCommentById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete comment' })
  @ApiOkResponse({ description: 'Comment deleted (void)' })
  @ApiNotFoundResponse({
    description: `There aren't any comments with this id`,
  })
  removeComment(@Param('id') id: string, @Request() req): Promise<void> {
    return this.commentsService.removeComment(id, req.user);
  }
}
