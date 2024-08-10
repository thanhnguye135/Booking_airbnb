import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse();

    this.logger.error(`HTTP ${status} Error: ${JSON.stringify(exceptionRes)}`);
    this.logger.error(
      `Request: ${JSON.stringify({
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers,
      })}`,
    );

    res.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
