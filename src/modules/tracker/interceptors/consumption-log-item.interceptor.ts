import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsumptionLog } from '../entities/consumption-log.entity';
import { HateoasResource } from '../../../types/hateoas.interface';
import { generateConsumptionLogLinks } from './consumption-log-hateoas.util';

@Injectable()
export class ConsumptionLogItemHateoasInterceptor implements NestInterceptor<
  ConsumptionLog,
  HateoasResource<ConsumptionLog>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResource<ConsumptionLog>> {
    return next.handle().pipe(
      map((data: ConsumptionLog) => {
        const response = generateConsumptionLogLinks(data);

        return response;
      }),
    );
  }
}
