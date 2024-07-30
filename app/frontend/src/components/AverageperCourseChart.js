import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';

const chartConfig = {
  averageScore: {
    label: "Average Score",
    color: "hsl(var(--primary))",
  },
};

const AverageperCourseChart = ({ data }) => {
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="w-full h-[300px]">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="courseName" tickLine={false} tickMargin={10} axisLine={false}>
            <Label value="Courses" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Average Scores" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AverageperCourseChart;
