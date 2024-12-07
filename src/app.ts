import * as fs from 'fs';

interface Account {
  account_category: string;
  account_type: string;
  value_type: string;
  total_value: number;
}

export class AccountMetricCalculator {
  private accounts: Account[];
  private revenue: number = 0;
  private expense: number = 0;

  constructor(jsonFile: string) {
    const jsonData = fs.readFileSync(jsonFile, 'utf-8');
    const parsedJson = JSON.parse(jsonData);
    this.accounts = parsedJson.data;
  }

  calculateRevenue(): number {
    var sum = 0;
    for (var index in this.accounts) {
      const account = this.accounts[index];
      if (account.account_category == 'revenue') {
        sum += account.total_value;
      }
    }
    this.revenue = sum;
    return sum;
  }

  calculateExpense(): number {
    var sum = 0;
    for (var index in this.accounts) {
      const account = this.accounts[index];
      if (account.account_category == 'expense') {
        sum += account.total_value;
      }
    }
    this.expense = sum;
    return sum;
  }

  // function to calculate the gross profit margin
  // adding up the total value of account_type == sales and value_type == debit
  // then divided by revenue
  calculateGPM(): number {
    var sum = 0;
    // check if revenue has been calculated before

    for (var index in this.accounts) {
      const account = this.accounts[index];

      if (account.account_type == 'sales' && account.value_type == 'debit') {
        sum += account.total_value;
      }
    }

    return sum / this.revenue;
  }

  // function to calculate net profit margin
  calculateNPM(): number {
    return (this.revenue - this.expense) / this.revenue;
  }

  caculateWCR(): number {
    var debitAssets = 0;
    var creditAssets = 0;

    const assetType = ['current', 'bank', 'current_accounts_receivable'];
    const liabilityType = ['current', 'current_accounts_payable'];

    for (var index in this.accounts) {
      const account = this.accounts[index];

      if (
        account.account_category === 'assets' &&
        account.value_type === 'debit' &&
        assetType.includes(account.account_type)
      ) {
        debitAssets += account.total_value;
      }
    }

    for (var index in this.accounts) {
      const account = this.accounts[index];

      if (
        account.account_category === 'assets' &&
        account.value_type === 'credit' &&
        assetType.includes(account.account_type)
      ) {
        creditAssets += account.total_value;
      }
    }

    var creditLiabilities = 0;
    var debitLiabilities = 0;

    for (var index in this.accounts) {
      const account = this.accounts[index];

      if (
        account.account_category === 'liability' &&
        account.value_type === 'credit' &&
        liabilityType.includes(account.account_type)
      ) {
        creditLiabilities += account.total_value;
      }
    }

    for (var index in this.accounts) {
      const account = this.accounts[index];

      if (
        account.account_category === 'liability' &&
        account.value_type === 'debit' &&
        liabilityType.includes(account.account_type)
      ) {
        debitLiabilities += account.total_value;
      }
    }

    const assets = debitAssets - creditAssets;
    const liabilities = creditLiabilities - debitLiabilities;

    return assets / liabilities;
  }

  formatCurrency(value: number): string {
    return `$${Math.round(value).toLocaleString()}`;
  }

  formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  calculateMetric() {
    const revenue = this.calculateRevenue();
    const expense = this.calculateExpense();
    const GPM = this.calculateGPM();
    const NPM = this.calculateNPM();
    const WCR = this.caculateWCR();

    console.log(`Revenue: ${this.formatCurrency(revenue)}`);
    console.log(`Expense: ${this.formatCurrency(expense)}`);
    console.log(`Gross Profit Margin: ${this.formatPercentage(GPM)}`);
    console.log(`Net Profit Margin: ${this.formatPercentage(NPM)}`);
    console.log(`Working Capital Ratio: ${this.formatPercentage(WCR)}`);
  }
}

const main = () => {
  const accountMetricCalculator = new AccountMetricCalculator('data.json');

  accountMetricCalculator.calculateMetric();
};

main();
