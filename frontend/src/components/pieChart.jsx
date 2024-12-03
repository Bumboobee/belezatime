import { colors } from "@/style/colors";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatToBRL } from "@/utils/currencyOperations";
import { Sector, Pie, PieChart, LabelList } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import PropTypes from "prop-types";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { key, fill, total } = payload[0].payload;

    return (
      <div className="custom-tooltip bg-brown-chocolate-600 rounded-lg p-2 flex gap-2 items-center">
        <div
          className="color-indicator bg-brown-chocolate-300 w-3.5 h-3.5 rounded-sm"
          style={{
            backgroundColor: `${fill}`,
          }}
        />

        <div className="tooltip-content">
          <div className="tooltip-details flex gap-3 items-end">
            <span className="text-zinc-200 text-xs">{key}</span>
            <span className="tooltip-value fill-[--color-label] text-xs text-white">{formatToBRL(total)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const PieChartContainer = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState([]);

  useEffect(() => {
    const arrayOfIndexes = data.map((_, index) => index);

    setActiveIndex(arrayOfIndexes);
  }, [data]);

  return (
    <Card className="bg-transparent m-0 p-0 border-none flex flex-col justify-center w-full h-full rounded-none shadow-none">
      <CardContent className="p-0 max-h-[80%] ">
        <ChartContainer config={{}} className="aspect-square">
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />

            <Pie
              data={data}
              innerRadius={0}
              strokeWidth={0}
              dataKey="percentage"
              labelLine={false}
              activeIndex={activeIndex}
              activeShape={({ outerRadius, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + props.payload.outerRadius} />
              )}
              nameKey="key"
            >
              <LabelList
                dataKey="percentage"
                stroke="none"
                fontSize={14}
                formatter={(value) => `${value}%`}
                style={{ fill: `${colors.base.white}` }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

PieChartContainer.propTypes = {
  data: PropTypes.array,
  payload: PropTypes.array,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

export default PieChartContainer;
