import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '@modules/auth/auth.service';
import { authConstants } from '@shared/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: authConstants.google.clientID,
      clientSecret: authConstants.google.clientSecret,
      callbackURL: authConstants.google.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
      ) {
    console.log('FOR TESTING: accessToken ',"\x1b[31m",accessToken, "\x1b[31m");
    }
}
