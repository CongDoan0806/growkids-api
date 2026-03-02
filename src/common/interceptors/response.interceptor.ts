import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/interfaces/apiResponse.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: any): ApiResponse<T> => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponse<T>;
        }

        return {
          success: true,
          message: 'Success',
          data: data as T,
        };
      }),
    );
  }
}
