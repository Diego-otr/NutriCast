import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DailyProgress } from '../entities/daily-progress.entity';
import { generateDailyProgressLinks } from './daily-progress-hateoas.util';
import { HateoasResource } from '../../../types/hateoas.interface';

@Injectable()
export class DailyProgressItemHateoasInterceptor implements NestInterceptor<
  DailyProgress,
  HateoasResource<DailyProgress>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResource<DailyProgress>> {
    return next.handle().pipe(
      map((data: DailyProgress) => {
        const response = generateDailyProgressLinks(data);

        return response;
      }),
    );
  }
}
