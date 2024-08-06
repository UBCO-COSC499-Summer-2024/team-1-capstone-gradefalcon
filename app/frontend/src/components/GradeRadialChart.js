import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card, CardContent } from '../components/ui/card';
import { ChartContainer } from '../components/ui/chart';

const GradeRadialChart = ({ grade, totalMarks }) => {
  const percentage = (grade / totalMarks) * 100;

  const data = [
    { name: 'grade', value: percentage, fill: 'hsl(var(--primary))' },
  ];

  return (
    <Card className="max-w-xs  border-none">
      <CardContent className="relative flex gap-4 p-4">
        {/* Chart Container */}
        <ChartContainer
          config={{
            grade: { label: 'Grade', color: 'hsl(var(--primary))' },
          }}
          className="mx-auto aspect-square w-full max-w-[80%]"
        >
          <RadialBarChart
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={data}
            innerRadius="80%"
            outerRadius="100%"
            barSize={70}  
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
            <RadialBar dataKey="value" background cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>

        {/* Grade Display in the Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl font-bold tabular-nums leading-none">
            {grade}/{totalMarks}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeRadialChart;
