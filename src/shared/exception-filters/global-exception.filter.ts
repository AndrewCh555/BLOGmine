import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CommonErrorMessages } from '@shared/common/errormessages-common/commonerrors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  localizedErrorMessage(
    errorMessage: string,
    errorMessageType: string | undefined,
    user_language: string | undefined,
  ) {
    const localizedErrors =
      CommonErrorMessages[user_language?.toUpperCase()] ||
      CommonErrorMessages.EN;

    return (
      (!!errorMessageType
        ? `${localizedErrors[errorMessageType]}: ${errorMessage}`
        : localizedErrors[errorMessage]) ||
      `${localizedErrors.UNEXPECTED_ERROR}: ${errorMessage}`
    );
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpError = exception instanceof HttpException;
    const { user_language } = ctx.getRequest().headers;

    const httpStatus = isHttpError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any = {
      statusCode: httpStatus,
      message: this.localizedErrorMessage(
        exception?.message,
        exception?.response?.type,
        user_language,
      ),
    };

    if (!isHttpError || httpStatus === 500) {
      responseBody = {
        ...responseBody,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        errors: exception?.cause?.errors || 'Errors unavailable',
        stacktrace: exception?.stack || 'Stacktrace unavailable',
      };

      console.log(responseBody);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
