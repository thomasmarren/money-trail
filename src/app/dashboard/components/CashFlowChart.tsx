import { Card, Title, BarChart } from "@tremor/react";

const chartdata = [
  {
    name: "Amphibians",
    "Number of threatened species": 2488,
  },
];

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

export const CashFlowChart = ({
  income,
  spend,
}: {
  income: number;
  spend: number;
}) => {
  const chartdata = [
    {
      name: "Cash Flow",
      Income: income,
      Spend: spend,
    },
  ];

  console.log(income);
  console.log(spend);

  return (
    <Card className="max-w-xl">
      <Title>Cash Flow</Title>
      <BarChart
        className="mt-6"
        data={chartdata}
        index="name"
        categories={["Income", "Spend"]}
        colors={["emerald", "rose"]}
        valueFormatter={valueFormatter}
        yAxisWidth={60}
      />
    </Card>
  );
};
