import { Injectable } from '@nestjs/common';
import { TwitterTokenVerificationDto } from '@modules/auth/dto';
import { TwitterApi } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';
import { OAuth } from 'oauth';

@Injectable()
export class TwitterAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async getUserData(tokens: TwitterTokenVerificationDto): Promise<any> {
    const { accessToken, secret } = tokens;
    const consumer = new OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      this.configService.get('TW_APP_KEY'),
      this.configService.get('TW_APP_SECRET'),
      '1.0A',
      this.configService.get('TW_APP_URL'),
      'HMAC-SHA1',
    );

    const verifyUserCredentials = new Promise((resolve) => {
      consumer.get(
        'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        accessToken,
        secret,
        (error, data: any, response) => {
          if (error) throw new Error(error.data);

          resolve(JSON.parse(data));
        },
      );
    });

    return await verifyUserCredentials;
  }

  async twitterSignUp(
    tokens?: TwitterTokenVerificationDto | null,
    request?,
  ): Promise<any> {
    const { email, name } = await this.getUserData(
      tokens || {
        accessToken: request.query.accessToken,
        secret: request.query.secret,
      },
    );

    return this.authService.handleOauthAuthorizaton({ name, email });
  }

  // FOR TESTING
  async getAuthLink(request) {
    const client1 = new TwitterApi({
      appKey: this.configService.get('TW_APP_KEY'),
      appSecret: this.configService.get('TW_APP_SECRET'),
    });
    const authLink = await client1.generateAuthLink(
      this.configService.get('TW_APP_URL'),
    );

    request.session.oauth_token_secret = authLink.oauth_token_secret;

    return authLink.url;
  }
}
