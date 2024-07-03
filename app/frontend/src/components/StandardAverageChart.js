// src/Instructor/StandardAverageChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StandardAverageChart = ({ data }) => {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="examDate" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="averageScore" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default StandardAverageChart;
