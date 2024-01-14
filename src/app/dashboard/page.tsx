"use client";

import { CashFlow } from "./components/CashFlow/CashFlow";
import { Header } from "./components/Header";
import { TransactionsTable } from "./components/TransactionsTable/TransactionsTable";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen py-12 px-24">
      <Header />
      <div className="w-100 mb-8">
        <CashFlow />
      </div>
      <TransactionsTable />
    </main>
  );
}
