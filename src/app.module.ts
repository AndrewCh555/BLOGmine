import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models, postgresConfig } from '@shared/configs';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { MailModule } from '@modules/mail/mail.module';
import { MailService } from '@modules/mail/mail.service';
import { FeedModule } from '@modules/feed/feed.module';
import { PassportModule } from '@nestjs/passport';
import { CommentsModule } from '@modules/comments/comments.module';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    PassportModule.register({ session: true }),
    SequelizeModule.forRoot({
      ...postgresConfig,
      models,
      autoLoadModels: true,
      logging: false,
    }),
    UserModule,
    AuthModule,
    MailModule,
    FeedModule,
    CommentsModule,
    StorageModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
