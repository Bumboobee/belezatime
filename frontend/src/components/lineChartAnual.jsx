import { colors } from "@/style/colors";
import { formatToBRL } from "@/utils/currencyOperations";
import { getCurrentDate, formatDateBrazil } from "@/utils/formatDate";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import PropTypes from "prop-types";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month, confirmedAppointments, unconfirmedAppointments, percentChangeConfirmedApp } = payload[0].payload;

    return (
      <div className="custom-tooltip bg-brown-chocolate-600 rounded-lg p-2 flex gap-2">
        <div className="color-indicator bg-brown-chocolate-300 w-1 rounded-sm" />

        <div className="tooltip-content flex flex-col gap-1">
          <span className="tooltip-asset fill-[--color-label] font-semibold text-zinc-100">{month}</span>
          <div className="tooltip-details flex gap-1 flex-col">
            <div className="flex gap-3">
              <span className="text-zinc-200 italic">Confirmados:</span>
              <span className="tooltip-value fill-[--color-label] text-zinc-100 font-semibold">
                {confirmedAppointments}
              </span>
            </div>

            <div className="flex gap-3">
              <span className="text-zinc-200 italic">Não Confirmados:</span>
              <span className="tooltip-value fill-[--color-label] text-zinc-100 font-semibold">
                {unconfirmedAppointments}
              </span>
            </div>

            <div className="flex gap-3">
              <span className="text-zinc-200 italic">Variação Confirmados (mês atual vs. passado)</span>
              <span className="tooltip-value fill-[--color-label] text-zinc-100 font-semibold">
                {percentChangeConfirmedApp === 0 ? percentChangeConfirmedApp : `${percentChangeConfirmedApp}%`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const LineChartAnual = ({ anualAppointmentsData }) => {
  const currentMonth = anualAppointmentsData[anualAppointmentsData.length - 1];
  const monthShort = `${currentMonth.month.slice(0, 3)}./${currentMonth.month.slice(-4)}`;

  return (
    <Card className="bg-transparent m-0 p-0 border-none flex flex-col justify-between w-full rounded-none h-full overflow-visible">
      <CardHeader className="p-4 flex gap-0">
        <CardTitle className="text-zinc-800 text-xs font-medium leading-none">
          Agendamentos até{" "}
          <span className="text-brown-chocolate-600 font-semibold underline">{formatDateBrazil(getCurrentDate())}</span>
        </CardTitle>

        <CardDescription className="mt-0 p-0 leading-none flex gap-1 flex-col">
          <div className="flex flex-col gap-1 text-2xs">
            <div className="flex items-center justify-between border-b border-brown-chocolate-200/50 pb-2">
              <span className="font-medium">
                Faturamento esperado em {monthShort} <span className="italic">(Incluí não confirmados*)</span>:
              </span>
              <div className="flex items-center gap-1">
                <span className="bg-brown-chocolate-800 text-brown-chocolate-100 font-semibold px-2 py-1 rounded">
                  {formatToBRL(currentMonth.monthlyRevenue)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className="font-medium">Confirmados em {monthShort}:</span>
              <span className="bg-green-800 text-green-100 font-semibold px-2 py-1 rounded">
                {currentMonth.confirmedAppointments}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Não Confirmados em {monthShort}:</span>
              <span className="bg-red-800 text-red-100 font-semibold px-2 py-1 rounded">
                {currentMonth.unconfirmedAppointments}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="max-h-[85%] overflow-visible">
        <ChartContainer config={{}} className="p-0 overflow-visible">
          <LineChart
            accessibilityLayer
            data={anualAppointmentsData}
            margin={{
              top: 5,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeWidth={0.2}
              strokeDasharray="3.3"
              stroke={`${colors.brownChocolate[800]}`}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              style={{ fill: `${colors.brownChocolate[500]}` }}
            />

            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Line
              dataKey="monthlyRevenue"
              type="natural"
              stroke={colors.brownChocolate[300]}
              strokeWidth={1}
              dot={{
                fill: `${colors.brownChocolate[700]}`,
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            >
              <LabelList
                className="font-medium"
                position="top"
                offset={8}
                style={{ fill: `${colors.brownChocolate[500]}` }}
                fontSize={12}
                formatter={(value) => (value === 0 ? null : formatToBRL(value))}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

LineChartAnual.propTypes = {
  anualAppointmentsData: PropTypes.array,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

export default LineChartAnual;
