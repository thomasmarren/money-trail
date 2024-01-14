import { RawTransaction } from "./../../../db/schema";
import { Institution } from "./../../../models/institution";
import csv from "csvtojson";
import { ApiError } from "./../../errors/api-error";
import { NextResponse } from "next/server";
import { Transaction } from "../../../models/transaction";
import fs from "fs";
import { Account } from "../../../models/account";

const parseAmount = (rawAmount: string) => {
  const string = rawAmount.replace(/[^\d.-]/g, "");
  const float = parseFloat(string);

  const amount = float * 100;
  if (rawAmount[0] === "(") return Math.round(amount);

  return -Math.round(amount);
};

const createId = (transaction: RawTransaction) => {
  return Buffer.from(
    JSON.stringify({
      Date: transaction.Date,
      Description: transaction.Description,
      Institution: transaction.Institution,
      Account: transaction.Account,
      Amount: transaction.Amount,
    })
  ).toString("base64");
};

export async function GET() {
  try {
    const transactions = await new Transaction().all();

    return NextResponse.json(transactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}

export async function POST() {
  try {
    let allTransactions: string[] = [];

    const files = fs.readdirSync(`./transaction-files`);

    const transactionFileName = files.find((file) => file !== ".gitkeep");

    const transactions = (await csv().fromFile(
      `./transaction-files/${transactionFileName}`
    )) as RawTransaction[];

    for (const transaction of transactions) {
      await new Institution().upsert({
        id: transaction.Institution,
      });

      const account = await new Account().upsert({
        id: transaction.Account,
        institutionId: transaction.Institution,
      });

      const amount = parseAmount(transaction.Amount);
      const cashBackAmount = account.cashBackPercent
        ? Math.round(amount * (account.cashBackPercent * 0.01))
        : 0;

      const id = createId(transaction);
      await new Transaction().createOrUpdate({
        id,
        create: {
          id,
          date: new Date(transaction.Date).toISOString(),
          amount,
          cashBackAmount,
          accountId: transaction.Account,
          payload: transaction,
        },
        update: {
          amount,
          cashBackAmount,
          payload: transaction,
        },
      });
    }

    return NextResponse.json(allTransactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}
