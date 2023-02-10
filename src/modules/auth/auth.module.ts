import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '@modules/mail/mail.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { User } from '@shared/models/user.model';
import { GoogleStrategy } from '@shared/strategies/google/google.strategy';
import { authConstants } from '@shared/common';
import { GoogleAuthService } from '@shared/strategies/google/googleAuth.service';
import { FacebookAuthService } from '@shared/strategies/facebook/facebookAuth.service';
import { TwitterAuthService } from '@shared/strategies/twitter/twitterAuth.service';

@Module({
  imports: [
    UserModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'a1b2c3d4e5f6',
      signOptions: {
        expiresIn: authConstants.expiresIn,
      },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FacebookAuthService,
    GoogleStrategy,
    GoogleAuthService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    TwitterAuthService,
  ],
})
export class AuthModule {}
