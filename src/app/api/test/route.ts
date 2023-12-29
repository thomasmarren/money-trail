import { NextResponse } from "next/server";
import { Account } from "../../../models/account";

export async function GET() {
  const accounts = await new Account().all();

  return NextResponse.json(accounts);
}
