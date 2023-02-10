// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
import { User } from '../models/user.model';
dotenv.config();
import { cleanEnv, num, str } from 'envalid';
import { Post } from '@shared/models/post.model';
import { Comment } from '@shared/models/comment.model';
import { UserPostLikes } from '@shared/models/likes/userpost.likes.model';
import { UserCommentLikes } from '@shared/models/likes/usercomment.likes.model';
import { PostImage } from '@shared/models/images/postImage.model';
import { Avatar } from '@shared/models/images/avatar.model';
import { ProfileWallpaper } from '@shared/models/images/profileWallpaper.model';
import { UserFollowers } from '@shared/models/userfollowers.model';

const env = cleanEnv(process.env, {
  POSTGRES_HOST: str(),
  POSTGRES_PORT: num({ default: 5432 }),
  POSTGRES_USERNAME: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DATABASE: str(),
  // POSTGRES_DATABASE_URL: str(),
});

export const postgresConfig = {
  dialect: 'postgres' as const,

  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  // databaseURL: env.POSTGRES_DATABASE_URL,
};

export const models = [
  User,
  Post,
  Comment,
  UserPostLikes,
  UserCommentLikes,
  PostImage,
  Avatar,
  ProfileWallpaper,
  UserFollowers,
];
