import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

const AverageperCourseChart = ({ data }) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseName">
        <Label value="Courses" offset={-5} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label value="Average Scores" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
      </YAxis>
      <Tooltip />
      <Legend />
      <Bar dataKey="averageScore" fill="#82ca9d" />
    </BarChart>
  );
};

export default AverageperCourseChart;