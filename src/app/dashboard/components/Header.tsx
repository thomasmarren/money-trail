import { DateRangePicker, DateRangePickerItem } from "@tremor/react";
import { useTransactionContext } from "../contexts/TransactionsContext";

export const Header = () => {
  const { range, setRange } = useTransactionContext();

  return (
    <div className="flex mb-12">
      <h1 className="text-5xl font-bold">💰 Money Trail</h1>
      <div className="ml-auto">
        <DateRangePicker
          className="max-w-lg ml-auto"
          value={range}
          onValueChange={setRange}
          selectPlaceholder="Select Range"
          color="rose"
        >
          <DateRangePickerItem
            key="current_month"
            value="current_month"
            from={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          >
            This month
          </DateRangePickerItem>
        </DateRangePicker>
      </div>
    </div>
  );
};
