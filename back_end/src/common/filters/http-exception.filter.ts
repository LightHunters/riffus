import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let details: unknown;

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === "string") {
        message = payload;
      } else if (payload && typeof payload === "object") {
        const obj = payload as Record<string, unknown>;
        message = (obj.message as string) ?? message;
        details = obj;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      details = exception.stack;
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({
      success: false,
      message,
      ...(details ? { details } : {}),
    });
  }
}
