import { instanceToPlain } from 'class-transformer';
import {
  HateoasResource,
  HateoasLinks,
} from '../../../types/hateoas.interface';
import { Profile } from '../entities/profile.entity';

export function generateProfileLinks(
  entity: Profile,
): HateoasResource<Profile> {
  const plainEntity = instanceToPlain(entity) as Profile;

  const links: HateoasLinks = {
    self: { href: `/profiles/${entity.id}`, method: 'GET' },
    update: { href: `/profiles/${entity.id}`, method: 'PATCH' },
    delete: { href: `/profiles/${entity.id}`, method: 'DELETE' },
  };

  if (entity.accountId) {
    links.account = { href: `/accounts/${entity.accountId}`, method: 'GET' };
  }

  return { ...plainEntity, _links: links };
}
