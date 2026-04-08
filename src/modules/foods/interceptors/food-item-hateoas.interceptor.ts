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
import { HateoasResource } from '../../../types/hateoas.interface';
import { Request } from 'express';

@Injectable()
export class FoodItemHateoasInterceptor implements NestInterceptor<
  Food,
  HateoasResource<Food>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResource<Food>> {
    const request: Request = context.switchToHttp().getRequest();
    const method = request.method;

    return next.handle().pipe(
      map((data: Food) => {
        const response = generateFoodLinks(data);

        // Agregar enlace para obtener todos los alimentos de la misma cuenta si es un GET de un solo alimento
        if (method === 'GET' && data.accountId) {
          response._links.allByAccount = {
            href: `/foods/account/${data.accountId}`,
            method: 'GET',
          };
        }

        return response;
      }),
    );
  }
}
