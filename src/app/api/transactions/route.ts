import { ApiError } from "./../../errors/api-error";
import { NextResponse } from "next/server";
import { Transaction } from "../../../models/transaction";

export async function GET() {
  try {
    const transactions = await new Transaction().allWithAccount();

    return NextResponse.json(transactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}

export async function POST() {
  try {
    let allTransactions: string[] = [];

    return NextResponse.json(allTransactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}
