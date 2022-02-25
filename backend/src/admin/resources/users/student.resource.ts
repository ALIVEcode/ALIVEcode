import { ResourceWithOptions } from 'adminjs';
import { UserParent } from './users.parent';
import { StudentEntity } from '../../../models/user/entities/user.entity';

const StudentResource: ResourceWithOptions = {
  resource: StudentEntity,
  options: { parent: UserParent },
};

export default StudentResource;