import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleDetails } from 'src/sales/entities/sale-details.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Between, Repository } from 'typeorm';
import { FilterByDatesAndBranchDto } from './dto/reports.dto';
import { Resupply } from 'src/branches/entities/resupply.entity';
import { CashWithdrawal } from 'src/sales/entities/cash-withdrawal.entity';
import { BranchCash } from 'src/sales/entities/branch-cash.entity';
import { date } from 'joi';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private saleDetailsRepository: Repository<SaleDetails>,
    @InjectRepository(Resupply)
    private resupplyRepository: Repository<Resupply>,
    @InjectRepository(CashWithdrawal)
    private cashWithdrawalRepository: Repository<CashWithdrawal>,
    @InjectRepository(BranchCash)
    private branchCashRepository: Repository<BranchCash>,
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

  async getFinancialReport(filter: FilterByDatesAndBranchDto) {
    const salesReport = [];
    let generalTotal = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const resuppliesReport = [];
    const expenseReport = [];
    let totalSuppliersExpenses = 0;
    let totalOtherExpenses = 0;
    let totalExpenses = 0;

    const start = new Date(filter.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filter.end);
    end.setDate(end.getDate() + 1);

    const branchSales = await this.saleRepository.find({
      order: { createAt: 'ASC' },
      where: {
        branch: { id: filter.branchId },
        createAt: Between(start, end),
      },
    });

    for (const sale of branchSales) {
      const saleDetails = await this.saleDetailsRepository.find({
        where: { sale: { id: sale.id } },
      });
      for (const detail of saleDetails) {
        generalTotal += detail.total;
        totalCost += detail.product.cost * detail.quantity;
        totalProfit += detail.profit;

        if (sale.paymentType === 'EFECTIVO') {
          totalCash += detail.total;
        } else {
          totalTransfer += detail.total;
        }

        salesReport.push({
          id: detail.id,
          date: detail.createAt,
          name: detail.product.name,
          quantity: detail.quantity,
          payMethod: sale.paymentType,
          individualPurchasePrice: detail.product.cost,
          totalPurchasePrice: detail.product.cost * detail.quantity,
          individualProfit: detail.product.price - detail.product.cost,
          totalProfit: detail.profit,
          individualSalePrice: detail.product.price,
          total: detail.total,
        });
      }
    }

    const resupplies = await this.resupplyRepository.find({
      order: { createAt: 'ASC' },
      where: {
        branch: { id: filter.branchId },
        createAt: Between(start, end),
      },
    });

    resupplies.forEach((resupply) => {
      resuppliesReport.push({
        id: resupply.id,
        date: resupply.createAt,
        totalProducts: resupply.productQuantity,
        totalPurchasePrice: resupply.totalCost,
      });
    });

    const expenses = await this.cashWithdrawalRepository.find({
      order: { createdAt: 'ASC' },
      where: {
        branch: { id: filter.branchId },
        createdAt: Between(start, end),
      },
    });
    expenses.forEach((expense) => {
      if (expense.type === 'PROVEEDORES') {
        totalSuppliersExpenses += expense.amount;
      } else if (expense.type === 'GASTO') {
        totalExpenses += expense.amount;
      } else {
        totalOtherExpenses += expense.amount;
      }

      expenseReport.push({
        id: expense.id,
        date: expense.createdAt,
        concept: expense.concept,
        type: expense.type,
        amount: expense.amount,
        withdrawalMethod: expense.withdrawalMethod,
      });
    });

    const balanceSheet = {
      generalTotal,
      totalProfit,
      totalExpenses,
      netIncomeOrLoss: totalProfit - totalExpenses,
    };

    return {
      sales: salesReport,
      totalCash,
      totalTransfer,
      generalTotal,
      totalCost,
      totalProfit,
      resupplies: resuppliesReport,
      expenses: expenseReport,
      totalSuppliersExpenses,
      totalOtherExpenses,
      totalExpenses,
      balanceSheet,
    };
  }

  async getDashboardSalesBranchCash(branchId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    let total = 0;
    const branchSales = await this.saleRepository.find({
      order: { createAt: 'ASC' },
      where: {
        branch: { id: branchId },
        createAt: Between(start, end),
      },
    });

    const branchCash = await this.branchCashRepository.findOne({
      where: { branch: { id: branchId } },
    });

    if (branchCash) {
      for (const sale of branchSales) {
        total += sale.total;
      }
    }
    const dashboard = {
      date: start.toLocaleDateString(),
      total: total,
      branchCash: branchCash.totalCash,
    };

    return dashboard;
  }
}
