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
import { HateoasCollection } from '../../../types/hateoas.interface';
import { Request } from 'express';

@Injectable()
export class DailyProgressCollectionHateoasInterceptor implements NestInterceptor<
  DailyProgress[],
  HateoasCollection<DailyProgress>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasCollection<DailyProgress>> {
    const request: Request = context.switchToHttp().getRequest();
    const profileId: string = request.params.profileId as string; // Extraemos el parámetro de la URL

    return next.handle().pipe(
      map((data: DailyProgress[]) => {
        return {
          items: data.map((dailyProgress) =>
            generateDailyProgressLinks(dailyProgress),
          ),
          _links: {
            self: {
              href: `/daily-progress/profile/${profileId}`,
              method: 'GET',
            },
            getOne: { href: `/daily-progress/{id}`, method: 'GET' },
            create: { href: `/daily-progress`, method: 'POST' },
          },
        };
      }),
    );
  }
}
