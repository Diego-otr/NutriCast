import { instanceToPlain } from 'class-transformer';
import { Food } from '../entities/food.entity';
import {
  HateoasResource,
  HateoasLinks,
} from '../../../types/hateoas.interface';

export function generateFoodLinks(entity: Food): HateoasResource<Food> {
  const plainEntity = instanceToPlain(entity) as Food;

  const links: HateoasLinks = {
    self: { href: `/foods/${entity.id}`, method: 'GET' },
    update: { href: `/foods/${entity.id}`, method: 'PATCH' },
    delete: { href: `/foods/${entity.id}`, method: 'DELETE' },
  };

  if (entity.accountId) {
    links.account = { href: `/accounts/${entity.accountId}`, method: 'GET' };
  }

  return { ...plainEntity, _links: links };
}
