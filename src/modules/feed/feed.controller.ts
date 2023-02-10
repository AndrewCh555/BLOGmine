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
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RawFileDataType } from '@shared/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Post as PostEntity } from '@shared/models/post.model';
import { User } from '@shared/models/user.model';
import { CreatePostRequestDto, UpdatePostRequestDto } from './dto';
import { PostResponseDto } from './dto/response';
import { FeedService } from './feed.service';

@Controller('posts')
@ApiTags('Feed')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @ApiOperation({ description: 'Create new post' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Created post', type: PostResponseDto })
  createPost(
    @Body() createPostDto: CreatePostRequestDto,
    @Request() req,
    @UploadedFiles() images?: RawFileDataType[] | undefined,
  ): Promise<PostEntity> {
    return this.feedService.createPost(createPostDto, images, req.user);
  }

  @Get()
  @ApiOperation({ description: 'Get all posts' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Array of all posts',
    type: PostResponseDto,
    isArray: true,
  })
  findAllPosts(): Promise<PostEntity[]> {
    return this.feedService.findAllPosts();
  }

  @Get('user/:id')
  @ApiOperation({ description: 'Get all posts for user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Array of all posts for specified user',
    type: PostResponseDto,
    isArray: true,
  })
  findAllPostsForUser(@Param('id') id: string): Promise<PostEntity[]> {
    return this.feedService.findAllPostsForUser(id);
  }

  @Get('search/caption/:caption')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Find posts by words from caption' })
  @ApiOkResponse({
    description:
      'Array of all posts that contain specified (entire) word(s) in caption',
    type: PostResponseDto,
    isArray: true,
  })
  findPostsByCaptionWords(
    @Param('caption') caption: string,
  ): Promise<PostEntity[]> {
    return this.feedService.findPostsByCaptionWords(caption);
  }

  @Get('search/tags/:tag')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Find posts by specified tag' })
  @ApiOkResponse({
    description: 'Array of all posts that include specified tag',
    type: PostResponseDto,
    isArray: true,
  })
  findPostsByTag(@Param('tag') tag: string): Promise<PostEntity[]> {
    return this.feedService.findPostsByTag(tag);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Like a post' })
  likePost(@Param('id') postId: string, @Request() req): Promise<void> {
    return this.feedService.likePost(postId, req.user);
  }

  @Get(':id/likes/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get users who liked this post' })
  @ApiOkResponse({
    description: 'Array of all users who liked specified post',
    type: UserResponseDto,
    isArray: true,
  })
  getPostLikesUsers(@Param('id') postId: string): Promise<User[]> {
    return this.feedService.getPostLikesUsers(postId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get post by id' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Post with specified id',
    type: PostResponseDto,
  })
  findOnePost(@Param('id') id: string): Promise<PostEntity> {
    return this.feedService.findPostById(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update post' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostRequestDto,
    @UploadedFiles() images: RawFileDataType[],
    @Request() req,
  ): Promise<void> {
    return this.feedService.updatePost(id, updatePostDto, req.user, images);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete post' })
  @ApiOkResponse({ description: 'Post deleted (void)' })
  @ApiNotFoundResponse({ description: `There aren't any posts with this id` })
  removePost(@Param('id') id: string, @Request() req): Promise<void> {
    return this.feedService.removePost(id, req.user);
  }
}
