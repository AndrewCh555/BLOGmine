import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { User } from '@shared/models/user.model';
import { catchError, firstValueFrom } from 'rxjs';
import { TokenDto } from '@modules/auth/dto';
import { AuthService } from '@modules/auth/auth.service';
import { UserOauthInfo } from '../types';

@Injectable()
export class FacebookAuthService {
  private readonly logger = new Logger(FacebookAuthService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  async facebookSignUp(accessToken): Promise<UserOauthInfo | TokenDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    const { name, email } = data;

    return this.authService.handleOauthAuthorizaton({ name, email });
  }
}
