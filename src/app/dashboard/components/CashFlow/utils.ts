import { TransactionTypeId } from "./../../../../db/schema";
import { TTransactionType } from "./../../../../models/transaction-type";
import { DateRangePickerValue } from "@tremor/react";
import { TTransaction } from "../../../../models/transaction";

export const isBill = (
  transaction: TTransaction & { type: TTransactionType }
) => {
  return transaction.type?.id === TransactionTypeId.Bill;
};

export const isCCPayment = (
  transaction: TTransaction & { type: TTransactionType }
) => {
  return transaction.type?.id === TransactionTypeId.CCPayment;
};

export const isTransfer = (
  transaction: TTransaction & { type: TTransactionType }
) => {
  return transaction.type?.id === TransactionTypeId.Transfer;
};

export const isAnnualFee = (
  transaction: TTransaction & { type: TTransactionType }
) => {
  return transaction.type?.id === TransactionTypeId.AnnualFee;
};

export const transactionFilter = ({
  range,
  transaction,
  extraFilters = [],
}: {
  range: DateRangePickerValue;
  transaction: TTransaction & { type: TTransactionType };
  extraFilters?: ((t: TTransaction & { type: TTransactionType }) => void)[];
}) => {
  if (!range.to || !range.from) return false;
  if (
    isCCPayment(transaction) ||
    isTransfer(transaction) ||
    extraFilters.some((filter) => filter(transaction))
  )
    return false;

  const date = new Date(transaction.date);
  return date >= range.from && date <= range.to;
};

export const filterSpend = ({
  range,
  transactions,
}: {
  range: DateRangePickerValue;
  transactions: (TTransaction & { type: TTransactionType })[];
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
