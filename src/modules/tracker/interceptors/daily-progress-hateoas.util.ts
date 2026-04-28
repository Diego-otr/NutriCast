import { instanceToPlain } from 'class-transformer';
import {
  HateoasResource,
  HateoasLinks,
} from '../../../types/hateoas.interface';
import { DailyProgress } from '../entities/daily-progress.entity';

export function generateDailyProgressLinks(
  entity: DailyProgress,
): HateoasResource<DailyProgress> {
  const plainEntity = instanceToPlain(entity) as DailyProgress;

  const links: HateoasLinks = {
    self: { href: `tracker/daily-progress/${entity.id}`, method: 'GET' },
    update: { href: `tracker/daily-progress/${entity.id}`, method: 'PATCH' },
    delete: { href: `tracker/daily-progress/${entity.id}`, method: 'DELETE' },
  };

  if (entity.profileId) {
    links.profile = { href: `/profiles/${entity.profileId}`, method: 'GET' };
  }

  return { ...plainEntity, _links: links };
}
