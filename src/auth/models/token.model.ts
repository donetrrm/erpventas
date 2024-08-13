import { Branch } from 'src/branches/entities/branch.entity';
import { Role } from 'src/users/entities/role.entity';

export interface PayloadTokenAdmin{
  user_id: string;
  role: Role;
  branch: Branch;
}
