import { TransactionTypeId } from "./../../../../db/schema";
import { TTransactionType } from "./../../../../models/transaction-type";
import { DateRangePickerValue } from "@tremor/react";
import { TTransaction } from "../../../../models/transaction";

export const isCCPayment = (
  transaction: TTransaction & { type: TTransactionType }
) => {
  return transaction.type?.id === TransactionTypeId.CCPayment;
};

export const transactionFilter = ({
  range,
  transaction,
}: {
  range: DateRangePickerValue;
  transaction: TTransaction & { type: TTransactionType };
}) => {
  if (!range.to || !range.from) return false;
  if (isCCPayment(transaction)) return false;

  const date = new Date(transaction.date);
  return date >= range.from && date <= range.to;
};

export const filterSpend = ({
  range,
  transactions,
}: {
  range: DateRangePickerValue;
  transactions: TTransaction[];
}) => {
  return (
    transactions
      .filter((transaction) => {
        if (transaction.amount < 0) return false;

        return transactionFilter({ range, transaction });
      })
      .reduce((total, transaction) => {
        return (total += transaction.amount);
      }, 0) / 100
  );
};

export const filterIncome = ({
  range,
  transactions,
}: {
  range: DateRangePickerValue;
  transactions: TTransaction[];
}) => {
  return (
    transactions
      .filter((transaction) => {
        if (transaction.amount >= 0) return false;

        return transactionFilter({ range, transaction });
      })
      .reduce((total, transaction) => {
        return (total -= transaction.amount);
      }, 0) / 100
  );
};

export const filterBills = ({
  range,
  transactions,
}: {
  range: DateRangePickerValue;
  transactions: (TTransaction & { type: TTransactionType })[];
}) => {
  return (
    transactions
      .filter((transaction) => {
        if (transaction.type.id !== TransactionTypeId.Bill) return false;

        return transactionFilter({ range, transaction });
      })
      .reduce((total, transaction) => {
        return (total -= transaction.amount);
      }, 0) / 100
  );
};
