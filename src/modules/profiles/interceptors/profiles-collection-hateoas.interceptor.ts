import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from '../entities/profile.entity';
import { generateProfileLinks } from './profiles-hateos.util';
import { HateoasCollection } from '../../../types/hateoas.interface';
import { Request } from 'express';

@Injectable()
export class ProfileCollectionHateoasInterceptor implements NestInterceptor<
  Profile[],
  HateoasCollection<Profile>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasCollection<Profile>> {
    const request: Request = context.switchToHttp().getRequest();
    const accountId: string = request.params.accountId as string; // Extraemos el parámetro de la URL

    return next.handle().pipe(
      map((data: Profile[]) => {
        return {
          items: data.map((profile) => generateProfileLinks(profile)),
          _links: {
            self: { href: `/profiles/account/${accountId}`, method: 'GET' },
            getOne: { href: `/profiles/{id}`, method: 'GET' },
            create: { href: `/profiles`, method: 'POST' },
          },
        };
      }),
    );
  }
}
