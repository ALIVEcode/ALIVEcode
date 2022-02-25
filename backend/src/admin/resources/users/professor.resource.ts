import { ResourceWithOptions } from 'adminjs';
import { UserParent } from './users.parent';
import { ProfessorEntity } from '../../../models/user/entities/user.entity';

const ProfessorResource: ResourceWithOptions = {
  resource: ProfessorEntity,
  options: { parent: UserParent },
};

export default ProfessorResource;