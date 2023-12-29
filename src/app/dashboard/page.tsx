"use client";

import { useState } from "react";
import { CashFlow } from "./components/CashFlow";
import { TransactionsTable } from "./components/TransactionsTable";

export default function Home() {
  const [date] = useState(new Date());

  return (
    <main className="flex flex-col min-h-screen py-12 px-24">
      <h1 className="text-7xl mb-8">
        {date.toLocaleString("default", { month: "long", year: "numeric" })}
      </h1>
      <div className="w-100 mb-8">
        <CashFlow date={date} />
      </div>
      <TransactionsTable date={date} />
    </main>
  );
}
