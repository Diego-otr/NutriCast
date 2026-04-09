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
import { HateoasResource } from '../../../types/hateoas.interface';

@Injectable()
export class ProfileItemHateoasInterceptor implements NestInterceptor<
  Profile,
  HateoasResource<Profile>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResource<Profile>> {
    return next.handle().pipe(
      map((data: Profile) => {
        const response = generateProfileLinks(data);

        return response;
      }),
    );
  }
}
