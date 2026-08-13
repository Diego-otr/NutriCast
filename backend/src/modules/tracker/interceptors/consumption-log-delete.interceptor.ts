import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HateoasMessage } from '../../../types/hateoas.interface';

@Injectable()
export class ConsumptionLogDeleteHateoasInterceptor implements NestInterceptor<
  { message: string },
  HateoasMessage
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasMessage> {
    return next.handle().pipe(
      map((data: { message: string }) => {
        return {
          ...data,
          _links: {
            create: { href: `/consumption-log`, method: 'POST' },
          },
        };
      }),
    );
  }
}
