import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from '../entities/food.entity';
import { generateFoodLinks } from './food-hateoas.util';
import { HateoasCollection } from '../../../types/hateoas.interface';
import { Request } from 'express';

@Injectable()
export class FoodCollectionHateoasInterceptor implements NestInterceptor<
  Food[],
  HateoasCollection<Food>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasCollection<Food>> {
    const request: Request = context.switchToHttp().getRequest();
    const accountId: string = request.params.accountId as string; // Extraemos el parámetro de la URL

    return next.handle().pipe(
      map((data: Food[]) => {
        return {
          items: data.map((food) => generateFoodLinks(food)),
          _links: {
            self: { href: `/foods/account/${accountId}`, method: 'GET' },
            create: { href: `/foods`, method: 'POST' },
          },
        };
      }),
    );
  }
}
