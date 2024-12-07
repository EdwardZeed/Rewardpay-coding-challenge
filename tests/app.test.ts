import { AccountMetricCalculator } from '../src/app';
import path from 'path';

describe('AccountMetricCalculator Tests', () => {
  const testJSONPath = path.resolve(__dirname, './test.json');
  const calculator: AccountMetricCalculator = new AccountMetricCalculator(
    testJSONPath
  );

  test('calculateRevenue test', () => {
    const revenue = calculator.calculateRevenue();
    expect(revenue).toBe(30000);
  });

  test('calculatExpense test', () => {
    const expense = calculator.calculateExpense();
    expect(expense).toBe(2000);
  });

  test('calculatGPM test', () => {
    const GPM = calculator.calculateGPM();
    expect(GPM).toBe(20000 / 30000);
  });

  test('calculatNPM test', () => {
    const NPM = calculator.calculateNPM();
    expect(NPM).toBe((30000 - 2000) / 30000);
  });

  test('calculatWCR test', () => {
    const WCR = calculator.caculateWCR();
    expect(WCR).toBe(-145000 / 7000);
  });

  test('formatCurrency test', () => {
    const formattedCurrency = calculator.formatCurrency(12345);
    expect(formattedCurrency).toBe('$12,345');
  });

  test('formatPercentage', () => {
    const formattedPercentage = calculator.formatPercentage(0.2056);
    expect(formattedPercentage).toBe('20.6%');
  });

  test('calculatMetric', () => {
    const consoleOutput = jest.spyOn(console, 'log').mockImplementation();
    calculator.calculateMetric();
    expect(consoleOutput.mock.calls.length).toBe(5);
    expect(consoleOutput.mock.calls[0]).toEqual(['Revenue: $30,000']);
    expect(consoleOutput.mock.calls[1]).toEqual(['Expense: $2,000']);
    expect(consoleOutput.mock.calls[2]).toEqual(['Gross Profit Margin: 66.7%']);
    expect(consoleOutput.mock.calls[3]).toEqual(['Net Profit Margin: 93.3%']);
    expect(consoleOutput.mock.calls[4]).toEqual([
      'Working Capital Ratio: -2071.4%',
    ]);
  });
});
