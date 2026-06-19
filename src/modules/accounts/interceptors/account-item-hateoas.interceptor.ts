import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../entities/account.entity';
import { HateoasResource } from '../../../types/hateoas.interface';
import { generateAccountLinks } from './account-hateoas.util';

@Injectable()
export class AccountItemHateoasInterceptor implements NestInterceptor<
  Account,
  HateoasResource<Account>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResource<Account>> {
    // Ningun trato especial para respuestas de un solo item de account
    // El interceptor de la entidad se encarga de agregar los enlaces necesarios

    return next.handle().pipe(
      map((data: Account) => {
        const response = generateAccountLinks(data);
        return response;
      }),
    );
  }
}
