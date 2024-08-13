import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/users.dtos';
import { UpdateUserDto } from '../dto/users.dtos';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const existUser = await this.userRepo.findOneBy({username: data.username});
    if (existUser) {
      throw new BadRequestException('Username already exists');
    }
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    const role = await this.roleRepo.findOneBy({id: data.roleId});
    if (!role) {
      throw new NotFoundException(`Role #${data.roleId} not found`);
    }
    if(data.branchId){
      const branch = await this.branchRepo.findOneBy({id: data.branchId});
      newUser.branch = branch;
    }
    newUser.role = role;
    return this.userRepo.save(newUser);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({where: {id}, relations: ["role", "branch"]});
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: string, changes: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({id});
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    if (changes.roleId) {
      const role = await this.roleRepo.findOneBy({id: changes.roleId});
      if (!role) {
        throw new NotFoundException(`Role #${changes.roleId} not found`);
      }
      user.role = role;
    }
    if (changes.branchId) {
      const branch = await this.branchRepo.findOneBy({id: changes.branchId});
      if (!branch) {
        throw new NotFoundException(`Branch #${changes.branchId} not found`);
      }
      user.branch = branch;
    }
    if(changes.password){
      const hashPassword = await bcrypt.hash(changes.password, 10);
      changes.password = hashPassword;
    }
    this.userRepo.merge(user, changes);
    
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepo.findOneBy({id});
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.userRepo.delete(id);
    return { message: `User with id: ${id} deleted succesfully` };
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username },relations: ['role','branch']});
  }
}
