import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import * as util from 'node:util';
import * as crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  OauthSignUpRequestDto,
  Payload,
  SignInRequestDto,
  SignUpRequestDto,
  TokenDto,
  VerificationCodeRequestDto,
} from './dto';
import { User } from '@shared/models/user.model';
import { CommonErrorTypes } from '@shared/common/errormessages-common/commonerrors';
import { UserOauthInfo } from '@shared/strategies/types';

const ENCRYPTITERATIONS = 50_000;
const ENCRYPTKEYLENGTH = 64;
const ENCRYPTDIGEST = 'sha512';
const PIN_CODE_LENGTH = 4;

export enum Provider {
  JWT = 'jwt',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(dto: SignUpRequestDto): Promise<TokenDto> {
    if (!dto.phone && !dto.email) {
      throw new BadRequestException(CommonErrorTypes.EMAILORPHONE_REQUIRED);
    }
    const existUser = await this.userService.findByEmailOrPhone(
      dto.phone || dto.email,
    );
    const existUserWithSameUsername =
      await this.userService.checkUsernameExists(dto.username);

    if (existUser) {
      throw new BadRequestException(CommonErrorTypes.USER_ALREADY_EXISTS);
    }
    if (existUserWithSameUsername) {
      throw new BadRequestException(CommonErrorTypes.USERNAME_ALREADY_EXISTS);
    }

    dto.password = await this.encryptPassword(dto.password);

    const user = await this.userService.create(dto);
    return this.endResponseUserJwtToken(user);
  }

  async login(dto: SignInRequestDto) {
    const user = await this.userService.findByEmailOrPhone(dto.emailOrPhone);

    if (!user) {
      throw new UnauthorizedException(
        CommonErrorTypes.INCORRECT_LOGINORPASSWORD,
      );
    }

    if (!(await this.checkPassword(dto.password, user.password))) {
      throw new UnauthorizedException(
        CommonErrorTypes.INCORRECT_LOGINORPASSWORD,
      );
    }
    return this.endResponseUserJwtToken(user);
  }

  // Oauth (providers)
  async handleOauthAuthorizaton(userOauthInfo: UserOauthInfo) {
    const user = await this.userService.findByEmailOrPhone(userOauthInfo.email);
    if (!user) {
      return userOauthInfo;
    }
    return this.endResponseUserJwtToken(user);
  }

  async oauthRegistration(dto: OauthSignUpRequestDto) {
    const { username, name, email } = dto;

    const existUser = await this.userService.findByEmailOrPhone(email);
    const existUserWithSameUsername =
      await this.userService.checkUsernameExists(username);

    if (existUser) {
      throw new BadRequestException(CommonErrorTypes.USER_ALREADY_EXISTS);
    }
    if (existUserWithSameUsername) {
      throw new BadRequestException(CommonErrorTypes.USERNAME_ALREADY_EXISTS);
    }

    const userDraft: SignUpRequestDto = {
      name,
      username,
      password: '',
      passwordConfirm: '',
      email,
    };
    const user = await this.userService.create(userDraft);

    return this.endResponseUserJwtToken(user);
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    return this.userService.checkUsernameExists(username);
  }

  async endResponseUserJwtToken(
    user: User,
    options: jsonwebtoken.SignOptions = { expiresIn: process.env.EXPIRE_TIME },
  ) {
    const payload = new Payload(user);
    return new TokenDto(this.jwtService.sign({ ...payload }, options));
  }

  async forgotPassword(dto: ForgotPasswordRequestDto) {
    const user = await this.userService.findByEmailOrPhone(dto.emailOrPhone);
    if (!user) {
      throw new BadRequestException(CommonErrorTypes.INCORRECT_LOGINORPASSWORD);
    }
    const pinCode = this.pinCodeGen();
    user.pinCode = pinCode;
    await this.userService.update(user.id, user);
    await this.mailService.sendUserResetPassword(user, pinCode);
  }

  async verificateCode(dto: VerificationCodeRequestDto) {
    await this.findUserAndCheckCode(dto.emailOrPhone, dto.code);
  }

  async changePassword(dto: ChangePasswordRequestDto): Promise<void> {
    const user = await this.userService.findByEmailOrPhone(dto.emailOrPhone);
    dto.password = await this.encryptPassword(dto.password);
    await this.userService.changePassword(user.id, dto.password);
  }

  signToken(user: User): string {
    const payload = {
      email: user.email,
      name: user.username,
    };

    return this.jwtService.sign(payload);
  }

  private async encryptPassword(plainPassword: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      plainPassword,
      salt,
      ENCRYPTITERATIONS,
      ENCRYPTKEYLENGTH,
      ENCRYPTDIGEST,
    );

    return salt + ':' + encryptedPassword.toString('hex');
  }

  private async checkPassword(
    password: string,
    existPassword: string,
  ): Promise<boolean> {
    const [salt, key] = existPassword.split(':');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      password,
      salt,
      ENCRYPTITERATIONS,
      ENCRYPTKEYLENGTH,
      ENCRYPTDIGEST,
    );
    return key === encryptedPassword.toString('hex');
  }

  private pinCodeGen() {
    const randomNumber = Math.random().toString();
    return randomNumber.substring(
      randomNumber.length,
      randomNumber.length - PIN_CODE_LENGTH,
    );
  }

  private async findUserAndCheckCode(emailOrPhone: string, code: string) {
    const user = await this.userService.findByEmailOrPhone(emailOrPhone);
    if (code !== user.pinCode) {
      throw new UnauthorizedException(CommonErrorTypes.INCORRECT_CODE);
    }
    return user;
  }
}
