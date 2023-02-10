import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: token,
    });
    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }

  async googleSignUp(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;
    const userData = await this.getUserData(token);

    return this.authService.handleOauthAuthorizaton({
      name: userData.name,
      email,
    });
  }
}
