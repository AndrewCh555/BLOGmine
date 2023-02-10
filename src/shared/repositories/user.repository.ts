import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { SignUpRequestDto } from '@modules/auth/dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserRequestDto } from '@modules/user/dto';
import { Op } from 'sequelize';
import { Post } from '@shared/models/post.model';
import { Avatar } from '@shared/models/images/avatar.model';
import { ProfileWallpaper } from '@shared/models/images/profileWallpaper.model';
import { UserFollowers } from '@shared/models/userfollowers.model';

export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly user: typeof User,
    @InjectModel(UserFollowers)
    private readonly userFollowers: typeof UserFollowers,
  ) {}

  async findByEmailOrPhone(phoneOrEmail: string): Promise<User> {
    return await this.user.findOne({
      where: {
        [Op.or]: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
      },
      include: [Avatar, ProfileWallpaper],
      nest: true,
      raw: true,
    });
  }

  async findByUsername(username: string): Promise<User[]> {
    return await this.user.findAll({
      where: { username: { [Op.iLike]: `${username}%` } },
      include: [Avatar],
      nest: true,
    });
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    return !!(
      await this.user.findAll({
        where: { username },
        nest: true,
      })
    ).length;
  }

  async findOneById(id: string): Promise<User> {
    return await this.user.findOne({
      where: { id },
      include: [
        {
          model: Post,
          as: 'posts',
        },
        Avatar,
        ProfileWallpaper,
      ],
      nest: true,
    });
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.user.findOne({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'followers',
          through: { attributes: [] },
        },
      ],
      nest: true,
    });

    return user.followers;
  }

  async getFollowingList(userId: string): Promise<User[]> {
    const user = await this.user.findOne({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'following',
          through: { attributes: [] },
        },
      ],
      nest: true,
    });

    return user.following as User[];
  }

  async findAll(): Promise<User[]> {
    return await this.user.findAll({});
  }

  async updateUser(id: string, updateUserDto: UpdateUserRequestDto) {
    await this.user.update(updateUserDto, {
      where: { id },
    });
  }

  async create(dto: SignUpRequestDto): Promise<User> {
    try {
      return await this.user.create(dto);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async changePassword(id: string, password: string): Promise<void> {
    await this.user.update(
      {
        password,
        changedPassword: true,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async delete(id: string): Promise<void> {
    await this.user.destroy({
      where: { id },
    });
  }

  async follow(
    followUserId: string,
    ownUserId: string,
  ): Promise<number | UserFollowers> {
    if (followUserId === ownUserId)
      throw new BadRequestException('Following own user is not allowed');

    const isAlreadyFollowing = !!(await this.userFollowers.findOne({
      where: { userId: followUserId, followerId: ownUserId },
    }));
    if (isAlreadyFollowing) {
      return await this.userFollowers.destroy({
        where: { userId: followUserId, followerId: ownUserId },
      });
    }
    return await this.userFollowers.create({
      userId: followUserId,
      followerId: ownUserId,
    });
  }
}
