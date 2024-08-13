import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FilterByDatesAndBranchDto } from './dto/reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/getSalesByDatesAndBranch')
  getSalesByDayAndBranch(@Query() params: FilterByDatesAndBranchDto){
    return this.reportsService.getSalesByDatesAndBranch(params);
  }
}
