"use client";

import { DateRangePickerValue } from "@tremor/react";
import { useState } from "react";
import { CashFlow } from "./components/CashFlow/CashFlow";
import { Header } from "./components/Header";
import { TransactionsTable } from "./components/TransactionsTable/TransactionsTable";

export default function Home() {
  const [range, setRange] = useState<DateRangePickerValue>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  return (
    <main className="flex flex-col min-h-screen py-12 px-24">
      <Header range={range} setRange={setRange} />
      <div className="w-100 mb-8">
        <CashFlow range={range} />
      </div>
      <TransactionsTable range={range} />
    </main>
  );
}
