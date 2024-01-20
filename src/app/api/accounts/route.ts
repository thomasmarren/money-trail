import { NextResponse } from "next/server";
import { Account } from "../../../models/account";
import { ApiError } from "../../errors/api-error";

export async function GET() {
  try {
    const transactions = await new Account().all();

    return NextResponse.json(transactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}
