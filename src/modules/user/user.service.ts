import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserRequestDto } from './dto';
import { UserRepository } from '@shared/repositories/user.repository';
import { User } from '@shared/models/user.model';
import { SignUpRequestDto } from '../auth/dto';
import { CommonErrorTypes } from '@shared/common/errormessages-common/commonerrors';
import { RawFileDataType } from '@shared/common';
import { StorageService } from '@modules/storage/storage.service';
import { AvatarRepository } from '@shared/repositories/images/avatar.repository';
import { ProfileWallpaperRepository } from '@shared/repositories/images/profilewallpaper.repository';
import { UserJwtPayload } from '@shared/common/interface/user-jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
    private readonly avatarRepository: AvatarRepository,
    private readonly profileWallpaperRepository: ProfileWallpaperRepository,
  ) {}

  async changePassword(id: string, password: string): Promise<void> {
    await this.userRepository.changePassword(id, password);
  }

  async findByEmailOrPhone(phoneOrEmail: string) {
    return await this.userRepository.findByEmailOrPhone(phoneOrEmail);
  }

  async findByUsername(username: string): Promise<User[]> {
    return await this.userRepository.findByUsername(username);
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    return await this.userRepository.checkUsernameExists(username);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        type: CommonErrorTypes.NO_USER_FOR_ID,
        message: id,
      });
    }
    return user;
  }

  async getFollowers(userId: string): Promise<User[]> {
    return await this.userRepository.getFollowers(userId);
  }

  async getFollowingList(userId: string): Promise<User[]> {
    return await this.userRepository.getFollowingList(userId);
  }

  async follow(
    followUserId: string,
    ownUserFromJwt: UserJwtPayload,
  ): Promise<void> {
    const ownUserId = (await this.findByEmailOrPhone(ownUserFromJwt.email)).id;

    await this.userRepository.follow(followUserId, ownUserId);
  }

  async create(dto: SignUpRequestDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserRequestDto,
    newAvatar?: RawFileDataType,
    newWallpaper?: RawFileDataType,
  ): Promise<void> {
    if (newAvatar) {
      await this.avatarRepository.deleteForUserId(id);

      const storageAvatar = await this.storageService.saveFile(newAvatar);
      await this.avatarRepository.save(storageAvatar, id);
    }
    if (newWallpaper) {
      await this.profileWallpaperRepository.deleteForUserId(id);

      const storageWallpaper = await this.storageService.saveFile(newWallpaper);
      await this.profileWallpaperRepository.save(storageWallpaper, id);
    }

    await this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        type: CommonErrorTypes.NO_USER_FOR_ID,
        message: id,
      });
    }

    await this.cleanupProfileImages(user.id);
    await this.userRepository.delete(user.id);
  }

  async cleanupProfileImages(userId: string) {
    await this.avatarRepository.deleteForUserId(userId);
    await this.profileWallpaperRepository.deleteForUserId(userId);
  }
}
