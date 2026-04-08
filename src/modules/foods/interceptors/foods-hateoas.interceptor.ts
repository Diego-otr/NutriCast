import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HateoasResponse,
  HateoasResource,
  HateoasCollection,
  HateoasMessage,
  HateoasLinks,
} from '../../../types/hateoas.interface';
import { Food } from '../entities/food.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class FoodsHateoasInterceptor implements NestInterceptor<
  Food | Food[] | { message: string },
  HateoasResponse<Food>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HateoasResponse<Food>> {
    const request: Request = context.switchToHttp().getRequest();
    const method: string = request.method;

    return next.handle().pipe(
      map((data: Food | Food[] | { message: string }) => {
        // Respuesta de simple (DELETE)
        if (method === 'DELETE' && 'message' in data) {
          const response: HateoasMessage = {
            ...data,
            _links: {
              create: { href: `/foods`, method: 'POST' },
            },
          };
          return response;
        }

        // Respuesta de colección (Array de Foods)
        if (Array.isArray(data)) {
          const accountId: string = request.params.accountId as string;
          const response: HateoasCollection<Food> = {
            items: data.map((food) => this.generateBaseLinks(food)),
            _links: {
              self: { href: `/foods/account/${accountId}`, method: 'GET' },
              create: { href: `/foods`, method: 'POST' },
            },
          };
          return response;
        }

        // Respuesta de objeto individual (GET id, POST, PATCH)
        const foodItem = data as Food;
        const response: HateoasResource<Food> =
          this.generateBaseLinks(foodItem);

        // Agregar enlace para obtener todos los alimentos de la misma cuenta si es un GET de un solo alimento
        if (method === 'GET' && foodItem.accountId) {
          response._links.allByAccount = {
            href: `/foods/account/${foodItem.accountId}`,
            method: 'GET',
          };
        }

        return response;
      }),
    );
  }

  // 1. Recibe directamente tu entidad Food
  // 2. Devuelve un recurso HATEOAS tipado estrictamente para Food
  private generateBaseLinks(entity: Food): HateoasResource<Food> {
    // Transformamos la instancia de TypeORM a objeto plano
    const plainEntity = instanceToPlain(entity) as Food;

    // Construimos los enlaces base
    const links: HateoasLinks = {
      self: { href: `/foods/${entity.id}`, method: 'GET' },
      update: { href: `/foods/${entity.id}`, method: 'PATCH' },
      delete: { href: `/foods/${entity.id}`, method: 'DELETE' },
    };

    // Enlace adicional para la cuenta del alimento
    if (entity.accountId) {
      links.account = { href: `/accounts/${entity.accountId}`, method: 'GET' };
    }

    return {
      ...plainEntity,
      _links: links,
    };
  }
}
