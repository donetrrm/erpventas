import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleDetails } from 'src/sales/entities/sale-details.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Between, Repository } from 'typeorm';
import { FilterByDatesAndBranchDto } from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private saleDetailsRepository: Repository<SaleDetails>,
  ) {}

  async getSalesByDatesAndBranch(filter: FilterByDatesAndBranchDto) {
    const start = new Date(filter.start);
    const end = new Date(filter.end);
    end.setDate(end.getDate() + 1);
    const branchSales = await this.saleRepository.find({
      order: { createAt: 'ASC' },
      where: {
        branch: { id: filter.branchId },
        createAt: Between(start, end),
      },
    });
    return branchSales;
  }
}