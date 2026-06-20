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

        response._links.finalize = {
          href: `/tracker/daily-progress/${data.id}/finalize`,
          method: 'PATCH',
        };
        response._links.skip = {
          href: `/tracker/daily-progress/${data.id}/skip`,
          method: 'PATCH',
        };
        response._links.addLog = {
          href: `/tracker/daily-progress/${data.id}/add-log`,
          method: 'PATCH',
        };

        if (data.logs && data.logs.length > 0) {
          response._links.removeLog = {
            href: `/tracker/daily-progress/${data.id}/remove-log/{logId}`,
            method: 'DELETE',
          };
        }

        return response;
      }),
    );
  }
}
