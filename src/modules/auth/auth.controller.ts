import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SignInRequestDto,
  SignUpRequestDto,
  ForgotPasswordRequestDto,
  ChangePasswordRequestDto,
  VerificationCodeRequestDto,
  TokenDto,
  OauthSignUpRequestDto,
  CheckUsernameExistsRequestDto,
  JwtTokenResponseDto,
  OauthUserInfoResponseDto,
} from './dto';
import { User } from '@shared/models/user.model';
import { GoogleAuthGuard } from '@shared/strategies/google/google-auth.guard';
import {
  TokenVerificationDto,
  TwitterTokenVerificationDto,
} from '@modules/auth/dto/request/tokenVerification.dto';
import { GoogleAuthService } from '@shared/strategies/google/googleAuth.service';
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';
import { FacebookAuthService } from '@shared/strategies/facebook/facebookAuth.service';
import { TwitterAuthService } from '@shared/strategies/twitter/twitterAuth.service';
import { UserOauthInfo } from '@shared/strategies/types';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthenticationService: GoogleAuthService,
    private readonly facebookAuthenticationService: FacebookAuthService,
    private readonly twitterAuthenticationService: TwitterAuthService,
  ) {}

  @Post('registration')
  @UseInterceptors(TokenInterceptor)
  @ApiOkResponse({ description: 'JWT token', type: JwtTokenResponseDto })
  async register(@Body() signUpDto: SignUpRequestDto): Promise<TokenDto> {
    return this.authService.registration(signUpDto);
  }

  @Post('login')
  @UseInterceptors(TokenInterceptor)
  @ApiOkResponse({ description: 'JWT token', type: JwtTokenResponseDto })
  async login(@Body() signInDto: SignInRequestDto): Promise<TokenDto> {
    return this.authService.login(signInDto);
  }

  @Post('oauthRegistration')
  @ApiOperation({
    description: 'Simple registration from Register With Provider screen',
  })
  @UseInterceptors(TokenInterceptor)
  @ApiOkResponse({ description: 'JWT token', type: JwtTokenResponseDto })
  async oauthRegistration(@Body() signUpDto: OauthSignUpRequestDto) {
    return this.authService.oauthRegistration(signUpDto);
  }

  @Post('checkUsernameExists')
  @ApiOkResponse({ description: 'Boolean value' })
  async checkUsernameExists(
    @Body() dto: CheckUsernameExistsRequestDto,
  ): Promise<boolean> {
    return this.authService.checkUsernameExists(dto.username);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @Patch('passwordChange')
  async passwordChange(
    user: User,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<void> {
    await this.authService.changePassword(dto);
  }

  @Post('verificationCode')
  async verification(
    @Body() verifDto: VerificationCodeRequestDto,
  ): Promise<void> {
    return this.authService.verificateCode(verifDto);
  }

  @Post('google')
  @UseInterceptors(TokenInterceptor)
  @ApiExtraModels(JwtTokenResponseDto, OauthUserInfoResponseDto)
  @ApiOkResponse({
    description:
      'JWT token if email is already registered (login), user name and email if unregistered',
    schema: { oneOf: refs(JwtTokenResponseDto, OauthUserInfoResponseDto) },
  })
  async authenticateWithGoogle(
    @Body() tokenData: TokenVerificationDto,
  ): Promise<TokenDto | UserOauthInfo> {
    return await this.googleAuthenticationService.googleSignUp(tokenData.token);
  }

  @Post('facebook')
  @UseInterceptors(TokenInterceptor)
  @ApiExtraModels(JwtTokenResponseDto, OauthUserInfoResponseDto)
  @ApiOkResponse({
    description:
      'JWT token if email is already registered (login), user name and email if unregistered',
    schema: { oneOf: refs(JwtTokenResponseDto, OauthUserInfoResponseDto) },
  })
  async authenticateWithFacebook(
    @Body() tokenData: TokenVerificationDto,
  ): Promise<TokenDto | UserOauthInfo> {
    return await this.facebookAuthenticationService.facebookSignUp(
      tokenData.token,
    );
  }

  @Post('twitter')
  @UseInterceptors(TokenInterceptor)
  @ApiExtraModels(JwtTokenResponseDto, OauthUserInfoResponseDto)
  @ApiOkResponse({
    description:
      'JWT token if email is already registered (login), user name and email if unregistered',
    schema: { oneOf: refs(JwtTokenResponseDto, OauthUserInfoResponseDto) },
  })
  async authenticateWithTwitter(
    @Body() tokensData: TwitterTokenVerificationDto,
  ): Promise<TokenDto | UserOauthInfo> {
    return await this.twitterAuthenticationService.twitterSignUp(tokensData);
  }
  // // FOR TESTING
  // // for getting accessToken
  // @UseGuards(GoogleAuthGuard)
  // @Get('TEST/google/login')
  // @ApiOperation({ description: 'TEST' })
  // async handleLogin() {
  //   return { msg: 'Google Authentication' };
  // }
  // @UseGuards(GoogleAuthGuard)
  // @Get('TEST/google/redirect')
  // @ApiOperation({ description: 'TEST' })
  // async handleRedirect() {
  //   return { msg: 'Ok' };
  // }

  // // FOR TESTING
  // // for getting twitter authLink and access tokens
  // @Get('TEST/twitter/getAuthLink')
  // @ApiOperation({ description: 'TEST' })
  // async getTwitterAuthLink(@Request() req) {
  //   return await this.twitterAuthenticationService.getAuthLink(req);
  // }
  // @Get('TEST/twitter/redirect')
  // @UseInterceptors(TokenInterceptor)
  // @ApiOperation({ description: 'TEST' })
  // async checkTwitterLogin(@Request() req) {
  //   return await this.twitterAuthenticationService.twitterSignUp(null, req);
  // }
}
