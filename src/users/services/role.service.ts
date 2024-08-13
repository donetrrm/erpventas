import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dtos';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  async create(data: CreateRoleDto) {
    const newRole = this.roleRepo.create(data);
    return this.roleRepo.save(newRole);
  }

  findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOneBy({id});
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }

  async update(id: string, changes: UpdateRoleDto) {
    const role = await this.roleRepo.findOneBy({id});
    this.roleRepo.merge(role, changes);
    return this.roleRepo.save(role);
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOneBy({id});
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    await this.roleRepo.delete(id);
    return { message: `Role with id: ${id} deleted succesfully` };
  }
}
