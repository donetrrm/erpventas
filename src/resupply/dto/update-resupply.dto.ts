import { PartialType } from '@nestjs/swagger';
import { CreateResupplyDto } from './create-resupply.dto';

export class UpdateResupplyDto extends PartialType(CreateResupplyDto) {}
