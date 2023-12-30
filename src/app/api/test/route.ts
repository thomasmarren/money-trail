import { NextResponse } from "next/server";
import { Transaction } from "../../../models/transaction";

export async function GET() {
  const transactions = await new Transaction().all();

  for (const transaction of transactions) {
    const id = Buffer.from(JSON.stringify(transaction)).toString("base64");
    await new Transaction().update(transaction.id, { id });
  }

  return NextResponse.json(transactions);
}
