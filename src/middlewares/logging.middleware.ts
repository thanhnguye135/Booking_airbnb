import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, query, params, body } = req;
    const timestamp = new Date().toISOString();
    console.log(req);
    this.logger.log({
      message: `Incoming Request`,
      method,
      url: originalUrl,
      headers,
      query,
      params,
      body,
      timestamp,
    });

    // res.on('finish', () => {
    //   const { statusCode } = res;
    //   const contentLength = res.get('Content-Length');

    //   this.logger.info({
    //     message: `Outgoing Response`,
    //     context: 'HTTP',
    //     method,
    //     url: originalUrl,
    //     statusCode,
    //     contentLength,
    //     timestamp: new Date().toISOString(),
    //   });
    // });

    next();
  }
}
