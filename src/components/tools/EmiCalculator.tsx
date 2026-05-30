'use client';

import { useState, useMemo } from 'react';
import { IndianRupee, Percent, Calendar, Calculator, TrendingDown, PieChart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import ToolLayout from '@/components/ToolLayout';

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'What is EMI?',
    answer:
      'EMI stands for Equated Monthly Installment. It is the fixed payment amount made by a borrower to a lender at a specified date each month. EMIs cover both principal and interest components of a loan.',
  },
  {
    question: 'How is EMI calculated?',
    answer:
      'EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate (annual rate / 12 / 100), and n is the total number of monthly installments.',
  },
  {
    question: 'Does a higher tenure reduce my EMI?',
    answer:
      'Yes, choosing a longer tenure reduces your monthly EMI because the principal is spread over more months. However, you end up paying significantly more total interest over the life of the loan.',
  },
  {
    question: 'Can I prepay my loan to reduce interest?',
    answer:
      'Yes, most lenders allow part-prepayment or full prepayment of loans. Making prepayments reduces the outstanding principal, which in turn reduces the total interest payable. Check with your lender about any prepayment charges.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Percentage Calculator',
    hash: '#/tools/percentage-calculator',
    description: 'Calculate percentages, discounts, and markups easily.',
  },
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'JSON Formatter',
    hash: '#/tools/json-formatter',
    description: 'Format and validate JSON data instantly.',
  },
];

/* ─── Types ─── */
type TenureMode = 'years' | 'months';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: AmortizationRow[];
}

/* ─── Indian Currency Formatter ─── */
function formatIndianCurrency(value: number): string {
  const numStr = value.toFixed(0);
  const [intPart, decPart] = numStr.split('.');

  let lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return decPart ? `₹${formatted}.${decPart}` : `₹${formatted}`;
}

/* ─── EMI Calculation ─── */
function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EmiResult {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
  }

  const monthlyRate = annualRate / 12 / 100;
  const n = tenureMonths;
  const r = monthlyRate;

  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  // Amortization schedule
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= n; month++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance -= principalPart;
    if (balance < 0) balance = 0;

    schedule.push({
      month,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interestPart * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    schedule,
  };
}

/* ─── Component ─── */
interface EmiCalculatorProps {
  onNavigate: (hash: string) => void;
}

export default function EmiCalculator({ onNavigate }: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureMode, setTenureMode] = useState<TenureMode>('years');
  const [hasCalculated, setHasCalculated] = useState(false);

  const tenureMonths = useMemo(
    () => (tenureMode === 'years' ? tenure * 12 : tenure),
    [tenure, tenureMode]
  );

  const result = useMemo(
    () => calculateEMI(loanAmount, interestRate, tenureMonths),
    [loanAmount, interestRate, tenureMonths]
  );

  const principalPercent = result.totalPayment > 0
    ? (loanAmount / result.totalPayment) * 100
    : 0;
  const interestPercent = result.totalPayment > 0
    ? (result.totalInterest / result.totalPayment) * 100
    : 0;

  const displaySchedule = result.schedule.slice(0, 12);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const handleTenureModeChange = (mode: TenureMode) => {
    if (mode === tenureMode) return;
    if (mode === 'months') {
      // Convert years to months
      setTenure(tenure * 12);
    } else {
      // Convert months to years (round down, min 1)
      setTenure(Math.max(1, Math.round(tenure / 12)));
    }
    setTenureMode(mode);
  };

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Calculate your loan EMI, total interest, and payment schedule"
      icon={Calculator}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-8">
        {/* ─── Input Section ─── */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <IndianRupee className="h-4 w-4 text-[#00FFFF]" />
                Loan Amount
              </label>
              <span className="text-sm font-mono text-[#00FFFF] font-bold">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>
            <Slider
              value={[loanAmount]}
              min={10000}
              max={10000000}
              step={10000}
              onValueChange={(value) => {
                setLoanAmount(value[0]);
                setHasCalculated(false);
              }}
              className="w-full"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-[#555555]">₹10,000</span>
              <span className="text-[10px] text-[#555555]">₹1,00,00,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Percent className="h-4 w-4 text-[#8A2BE2]" />
                Interest Rate (p.a.)
              </label>
              <span className="text-sm font-mono text-[#8A2BE2] font-bold">
                {interestRate.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[interestRate]}
              min={0.5}
              max={30}
              step={0.1}
              onValueChange={(value) => {
                setInterestRate(value[0]);
                setHasCalculated(false);
              }}
              className="w-full"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-[#555555]">0.5%</span>
              <span className="text-[10px] text-[#555555]">30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Calendar className="h-4 w-4 text-[#00FFFF]" />
                Loan Tenure
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#00FFFF] font-bold">
                  {tenure} {tenureMode === 'years' ? (tenure === 1 ? 'Yr' : 'Yrs') : (tenure === 1 ? 'Mo' : 'Mos')}
                </span>
              </div>
            </div>
            <Slider
              value={[tenure]}
              min={tenureMode === 'years' ? 1 : 1}
              max={tenureMode === 'years' ? 30 : 360}
              step={1}
              onValueChange={(value) => {
                setTenure(value[0]);
                setHasCalculated(false);
              }}
              className="w-full"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-[#555555]">
                {tenureMode === 'years' ? '1 Yr' : '1 Mo'}
              </span>
              <span className="text-[10px] text-[#5555555]">
                {tenureMode === 'years' ? '30 Yrs' : '360 Mos'}
              </span>
            </div>

            {/* Tenure Mode Toggle */}
            <div className="flex gap-1 mt-3 bg-black/40 rounded-lg p-1 border border-[#1a1a1a] w-fit">
              <button
                onClick={() => handleTenureModeChange('years')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                  tenureMode === 'years'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/20'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Years
              </button>
              <button
                onClick={() => handleTenureModeChange('months')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                  tenureMode === 'months'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/20'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Months
              </button>
            </div>
          </div>
        </div>

        {/* ─── Calculate Button ─── */}
        <Button
          onClick={handleCalculate}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
        >
          <Calculator className="h-4 w-4 mr-2" />
          <span>Calculate EMI</span>
        </Button>

        {/* ─── Results Section ─── */}
        <div className={`transition-all duration-500 ${hasCalculated ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}`}>
          {/* EMI Highlight */}
          <div className="text-center mb-8 p-6 rounded-2xl bg-black/40 border border-[#1a1a1a] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent" />
            <p className="text-xs text-[#888888] uppercase tracking-widest mb-2">
              Monthly EMI
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white neon-text-blue tracking-tight">
              {formatIndianCurrency(result.emi)}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Principal */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#00FFFF]" />
                <span className="text-xs text-[#888888] uppercase tracking-wider">Principal</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatIndianCurrency(loanAmount)}
              </p>
            </div>

            {/* Total Interest */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#8A2BE2]" />
                <span className="text-xs text-[#888888] uppercase tracking-wider">Total Interest</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatIndianCurrency(result.totalInterest)}
              </p>
            </div>

            {/* Total Payment */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-3 w-3 text-[#AAAAAA]" />
                <span className="text-xs text-[#888888] uppercase tracking-wider">Total Payment</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatIndianCurrency(result.totalPayment)}
              </p>
            </div>
          </div>

          {/* Pie Chart & Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* CSS Pie Chart */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-4 w-4 text-[#555555]" />
                <span className="text-xs text-[#555555] uppercase tracking-wider">
                  Payment Breakdown
                </span>
              </div>
              <div
                className="w-44 h-44 rounded-full relative"
                style={{
                  background: `conic-gradient(
                    #00FFFF 0deg ${principalPercent * 3.6}deg,
                    #8A2BE2 ${principalPercent * 3.6}deg 360deg
                  )`,
                }}
              >
                <div className="absolute inset-4 rounded-full bg-[#111111] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-[#888888]">Ratio</p>
                    <p className="text-sm font-bold text-white">
                      {principalPercent.toFixed(0)}:{interestPercent.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-[#00FFFF]" />
                  <span className="text-xs text-[#AAAAAA]">Principal ({principalPercent.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-[#8A2BE2]" />
                  <span className="text-xs text-[#AAAAAA]">Interest ({interestPercent.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-col justify-center gap-4 p-6 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                Loan Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                  <span className="text-sm text-[#AAAAAA]">Loan Amount</span>
                  <span className="text-sm font-semibold text-white">
                    {formatIndianCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                  <span className="text-sm text-[#AAAAAA]">Interest Rate</span>
                  <span className="text-sm font-semibold text-white">
                    {interestRate.toFixed(1)}% p.a.
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                  <span className="text-sm text-[#AAAAAA]">Tenure</span>
                  <span className="text-sm font-semibold text-white">
                    {tenureMonths} months ({(tenureMonths / 12).toFixed(1)} yrs)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                  <span className="text-sm text-[#AAAAAA]">Monthly EMI</span>
                  <span className="text-sm font-semibold text-[#00FFFF]">
                    {formatIndianCurrency(result.emi)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                  <span className="text-sm text-[#AAAAAA]">Total Interest</span>
                  <span className="text-sm font-semibold text-[#8A2BE2]">
                    {formatIndianCurrency(result.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[#AAAAAA]">Total Payment</span>
                  <span className="text-sm font-bold text-white">
                    {formatIndianCurrency(result.totalPayment)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Amortization Schedule ─── */}
          {displaySchedule.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#555555]" />
                Amortization Schedule (First 12 Months)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#1a1a1a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black/60 border-b border-[#1a1a1a]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#888888] uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[#888888] uppercase tracking-wider">
                        EMI
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[#888888] uppercase tracking-wider">
                        Principal
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[#888888] uppercase tracking-wider">
                        Interest
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[#888888] uppercase tracking-wider">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySchedule.map((row, idx) => (
                      <tr
                        key={row.month}
                        className={`border-b border-[#1a1a1a]/50 transition-colors hover:bg-white/[0.02] ${
                          idx % 2 === 0 ? 'bg-black/20' : 'bg-black/10'
                        }`}
                      >
                        <td className="px-4 py-2.5 text-[#AAAAAA] font-mono text-xs">
                          {row.month}
                        </td>
                        <td className="px-4 py-2.5 text-right text-white font-mono text-xs">
                          {formatIndianCurrency(row.emi)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[#00FFFF] font-mono text-xs">
                          {formatIndianCurrency(row.principal)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[#8A2BE2] font-mono text-xs">
                          {formatIndianCurrency(row.interest)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[#AAAAAA] font-mono text-xs">
                          {formatIndianCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
