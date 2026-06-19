import { instanceToPlain } from 'class-transformer';
import { Account } from '../entities/account.entity';
import {
  HateoasResource,
  HateoasLinks,
} from '../../../types/hateoas.interface';

export function generateAccountLinks(
  entity: Account,
): HateoasResource<Account> {
  const plainEntity = instanceToPlain(entity) as Account;

  const links: HateoasLinks = {
    self: { href: `/accounts/${entity.id}`, method: 'GET' },
    delete: { href: `/accounts/${entity.id}`, method: 'DELETE' },
  };

  return { ...plainEntity, _links: links };
}
