import { Flex, MultiSelect, MultiSelectItem } from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { useApiGet } from "../../../hooks/useApiGet";
import { useTransactionContext } from "../../contexts/TransactionsContext";

export const Filter = () => {
  const { filters, setFilters } = useTransactionContext();

  const { data } = useApiGet<TAccount[]>("/api/accounts");

  const accounts = !data
    ? []
    : data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }

        return 0;
      });

  return (
    <>
      <h2>Filter</h2>
      <Flex
        justifyContent="end"
        style={{ maxWidth: "250px", marginBottom: "24px" }}
      >
        <MultiSelect
          value={filters}
          onValueChange={(values: string[]) => setFilters(values)}
        >
          <MultiSelectItem value="type.id:income">Income</MultiSelectItem>
          <MultiSelectItem value="type.id:paycheck">Paycheck</MultiSelectItem>
          <MultiSelectItem value="type.id:cc_payment">
            Credit Card Payment
          </MultiSelectItem>
          <MultiSelectItem value="type.id:monthly_remaining">
            Monthly Remaining
          </MultiSelectItem>
          {accounts.map((account) => {
            return (
              <MultiSelectItem
                key={account.id}
                value={`accountId:${account.id}`}
              >
                {account.name}
              </MultiSelectItem>
            );
          })}
        </MultiSelect>
      </Flex>
    </>
  );
};
