import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenVerificationDto {
  @ApiProperty({
    example:
      'EAAGlr6X6Jz0BAKteVLfFapzNgyFbSOlMzEVGkfb4xi3OmQZC5gNFe29N5BucWBheNZA6RPHHtZBQlZBOE9h8r4VGebQG2ZAxpncpiqS7XIsvU9DglYAlHbqZA6ealf0NYl2gJ1fN2ZCZCOmuHcvHJizEYwRCrlMkZCu2KLlFZAfsdSI7uovR0aJkoIOZBOVrN4qZCm8sg7GcUDK7s6YrRtibWXRnV1OT5M1vrKMLrZBn6wMvZCOqQMIZA1wlZCSOXSsEpZAZBLGtAZD',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class TwitterTokenVerificationDto {
  @ApiProperty({
    example: '1605469054948474880-ok2iPvpbhV5rCp43YaIpoxSNZq44lY',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    example: '2dyhlSIWWaCAKBZeDG5Ezm5TGtPQZXbExKGYQcXpesFQv',
  })
  @IsString()
  @IsNotEmpty()
  secret: string;
}
