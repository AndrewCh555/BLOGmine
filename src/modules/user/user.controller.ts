import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateUserRequestDto } from './dto';
import { UserResponseDto } from './dto/response';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { UserJwtPayload } from '@shared/common/interface/user-jwt-payload.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RawFileDataType } from '@shared/common';
import { User } from '@shared/models/user.model';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ description: 'Get all user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Array of all Users',
    type: UserResponseDto,
    isArray: true,
  })
  public async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ description: 'Get own user from JWT token' })
  @ApiOkResponse({ description: 'Own User', type: UserResponseDto })
  @HttpCode(HttpStatus.OK)
  findOwnUser(@Request() req): Promise<User> {
    const userFromJwt: UserJwtPayload = req.user;
    return this.userService.findByEmailOrPhone(userFromJwt.email);
  }

  @Get('search/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Find users by part of username' })
  @ApiOkResponse({
    description:
      'Array of all users whose usernames beginnings match search string',
    type: UserResponseDto,
    isArray: true,
  })
  findUsersByUsername(@Param('username') username: string): Promise<User[]> {
    return this.userService.findByUsername(username);
  }

  @Post('follow/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Follow or unfollow user by id' })
  followUser(
    @Param('userId') followUserId: string,
    @Request() req,
  ): Promise<void> {
    const ownUserFromJwt: UserJwtPayload = req.user;

    return this.userService.follow(followUserId, ownUserFromJwt);
  }

  @Get(':id/followers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get followers for user specified by id' })
  @ApiOkResponse({
    description: 'Array of follower users',
    type: UserResponseDto,
    isArray: true,
  })
  getUserFollowers(@Param('id') id: string): Promise<User[]> {
    return this.userService.getFollowers(id);
  }

  @Get(':id/following')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user specified by id following list' })
  @ApiOkResponse({
    description: 'Array of users who this user follows',
    type: UserResponseDto,
    isArray: true,
  })
  getUserFollowingList(@Param('id') id: string): Promise<User[]> {
    return this.userService.getFollowingList(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Find by ID user' })
  @ApiOkResponse({
    description: 'User with specified id',
    type: UserResponseDto,
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update user info' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'newAvatar' }, { name: 'newWallpaper' }]),
  )
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
    @UploadedFiles()
    images: {
      newAvatar?: RawFileDataType[] | undefined;
      newWallpaper?: RawFileDataType[] | undefined;
    },
  ): Promise<void> {
    const { newAvatar = [], newWallpaper = [] } = images;

    return this.userService.update(
      id,
      updateUserDto,
      newAvatar[0],
      newWallpaper[0],
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete user' })
  @ApiOkResponse({ description: 'User deleted (void)' })
  @ApiNotFoundResponse({ description: `There isn't any user with this id` })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
