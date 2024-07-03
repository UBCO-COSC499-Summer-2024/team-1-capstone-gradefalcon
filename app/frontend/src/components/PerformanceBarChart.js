// src/Instructor/PerformanceBarChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PerformanceBarChart = ({ data }) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseName" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="averageScore" fill="#82ca9d" />
    </BarChart>
  );
};

export default PerformanceBarChart;