import { instanceToPlain } from 'class-transformer';
import {
  HateoasResource,
  HateoasLinks,
} from '../../../types/hateoas.interface';
import { ConsumptionLog } from '../entities/consumption-log.entity';

export function generateConsumptionLogLinks(
  entity: ConsumptionLog,
): HateoasResource<ConsumptionLog> {
  const plainEntity = instanceToPlain(entity) as ConsumptionLog;

  const links: HateoasLinks = {
    self: { href: `tracker/consumption-log/${entity.id}`, method: 'GET' },
    update: { href: `tracker/consumption-log/${entity.id}`, method: 'PATCH' },
    delete: { href: `tracker/consumption-log/${entity.id}`, method: 'DELETE' },
  };

  if (entity.dailyProgressId) {
    links.dailyProgress = {
      href: `/tracker/daily-progress/${entity.dailyProgressId}`,
      method: 'GET',
    };
  }

  return { ...plainEntity, _links: links };
}
