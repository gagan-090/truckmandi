"use client";

import { useMemo, useState } from "react";
import { FINANCE_DEFAULTS, PRICE_BOUNDS } from "@/config/constants";
import { calculateEmi } from "@/features/finance/emi";
import { track } from "@/lib/analytics/analytics";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { formatCurrency, formatPriceShort } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";

export interface EmiCalculatorProps {
  /** Seeded from `?price=` when arriving from a listing. */
  initialPrice?: number;
}

/**
 * Interactive EMI calculator. Everything is derived on each render from
 * four numbers, so there is no state to keep in sync and no effect to run.
 */
export function EmiCalculator({ initialPrice }: EmiCalculatorProps) {
  const [price, setPrice] = useState(initialPrice ?? 1_200_000);
  const [downPercent, setDownPercent] = useState<number>(
    FINANCE_DEFAULTS.downPaymentPercent,
  );
  const [rate, setRate] = useState<number>(FINANCE_DEFAULTS.interestRate);
  const [tenure, setTenure] = useState<number>(FINANCE_DEFAULTS.tenureMonths);

  const downPayment = Math.round((price * downPercent) / 100);
  const result = useMemo(
    () =>
      calculateEmi({
        price,
        downPayment,
        annualRate: rate,
        tenureMonths: tenure,
      }),
    [price, downPayment, rate, tenure],
  );

  // One event per settled interaction, not one per slider tick.
  const reportChange = useDebouncedCallback(() => {
    track({
      name: "finance_calculated",
      amount: result.loanAmount,
      tenureMonths: tenure,
    });
  }, 800);

  const principalShare = result.totalPayable
    ? (result.loanAmount / result.totalPayable) * 100
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
      <div className="space-y-7 rounded-lg border border-steel-200 bg-white p-5 sm:p-6">
        <SliderField
          id="emi-price"
          label="Vehicle price"
          value={price}
          display={formatPriceShort(price)}
          min={100_000}
          max={PRICE_BOUNDS.max}
          step={25_000}
          onChange={(value) => {
            setPrice(value);
            reportChange();
          }}
          minLabel="₹1L"
          maxLabel="₹1Cr"
        />

        <SliderField
          id="emi-down"
          label="Down payment"
          value={downPercent}
          display={`${downPercent}% · ${formatPriceShort(downPayment)}`}
          min={0}
          max={60}
          step={1}
          onChange={(value) => {
            setDownPercent(value);
            reportChange();
          }}
          minLabel="0%"
          maxLabel="60%"
        />

        <SliderField
          id="emi-rate"
          label="Interest rate (per annum)"
          value={rate}
          display={`${rate.toFixed(1)}%`}
          min={FINANCE_DEFAULTS.minInterestRate}
          max={FINANCE_DEFAULTS.maxInterestRate}
          step={0.1}
          onChange={(value) => {
            setRate(value);
            reportChange();
          }}
          minLabel={`${FINANCE_DEFAULTS.minInterestRate}%`}
          maxLabel={`${FINANCE_DEFAULTS.maxInterestRate}%`}
        />

        <div>
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-steel-800">
              Loan tenure
            </span>
            <span className="tabular text-sm font-bold text-steel-900">
              {tenure} months
            </span>
          </div>
          <div
            role="group"
            aria-label="Loan tenure"
            className="grid grid-cols-3 gap-2 sm:grid-cols-6"
          >
            {[12, 24, 36, 48, 60, 84].map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => {
                  setTenure(months);
                  reportChange();
                }}
                aria-pressed={tenure === months}
                className={cn(
                  "tabular min-h-10 rounded-md border text-sm font-semibold transition-colors",
                  tenure === months
                    ? "border-steel-900 bg-steel-900 text-white"
                    : "border-steel-300 bg-white text-steel-700 hover:border-steel-400 hover:bg-steel-50",
                )}
              >
                {months / 12}y
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-steel-200 bg-steel-950 p-5 text-white sm:p-6">
        <p className="text-sm text-steel-400">Your monthly EMI</p>
        <p className="tabular mt-1.5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {formatCurrency(result.monthlyEmi)}
        </p>

        <div
          className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/10"
          role="img"
          aria-label={`Principal is ${Math.round(principalShare)} percent of the total amount payable`}
        >
          <div
            className="bg-brand-500"
            style={{ width: `${principalShare}%` }}
          />
          <div className="flex-1 bg-trust-500" />
        </div>

        <dl className="mt-5 space-y-3.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-steel-300">
              <span
                aria-hidden
                className="size-2.5 rounded-full bg-brand-500"
              />
              Loan amount
            </dt>
            <dd className="tabular font-bold">
              {formatCurrency(result.loanAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-steel-300">
              <span
                aria-hidden
                className="size-2.5 rounded-full bg-trust-500"
              />
              Total interest
            </dt>
            <dd className="tabular font-bold">
              {formatCurrency(result.totalInterest)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3.5">
            <dt className="text-steel-300">Total payable</dt>
            <dd className="tabular font-bold">
              {formatCurrency(result.totalPayable)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-steel-300">Down payment</dt>
            <dd className="tabular font-bold">{formatCurrency(downPayment)}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-steel-400">
          Indicative only. Lenders set the final rate based on vehicle age, your
          credit profile and the loan-to-value ratio they are willing to offer.
          Processing fees and insurance are not included.
        </p>
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-steel-800">
          {label}
        </label>
        <span className="tabular text-sm font-bold text-steel-900">
          {display}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-6 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand-600 [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:shadow-md"
        style={{
          // Painting the filled portion on the track keeps this to one element.
          background: `linear-gradient(to right, var(--color-brand-600) ${percent}%, var(--color-steel-200) ${percent}%)`,
          backgroundSize: "100% 6px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="flex justify-between text-xs text-steel-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
