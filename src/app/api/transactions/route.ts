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
  if (rawAmount[0] === "(") return amount;

  return -amount;
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

    const files = fs.readdirSync(`./transactions`);

    const transactionFileName = files.find((file) => file !== ".gitkeep");

    const transactions = (await csv().fromFile(
      `./transactions/${transactionFileName}`
    )) as RawTransaction[];

    await Promise.all(
      transactions.map((transaction) => {
        new Institution()
          .upsert({
            id: transaction.Institution,
          })
          .then(async () => {
            return new Account()
              .upsert({
                id: transaction.Account,
                institutionId: transaction.Institution,
              })
              .then(() => {
                const id = createId(transaction);

                return new Transaction().createOrUpdate({
                  id,
                  create: {
                    id,
                    date: new Date(transaction.Date).toISOString(),
                    amount: parseAmount(transaction.Amount),
                    accountId: transaction.Account,
                    payload: transaction,
                  },
                  update: {
                    amount: parseAmount(transaction.Amount),
                    payload: transaction,
                  },
                });
              });
          });
      })
    );

    return NextResponse.json(allTransactions);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}
