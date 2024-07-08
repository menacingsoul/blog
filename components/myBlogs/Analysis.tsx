'use client'
import React from 'react';
import { ArrowBigDown,ArrowBigUp } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisProps {
  viewCount: number[];
  title:string;
  viewerCountry: { [key: string]: number };
  viewDate: string[];
  comments: number[];
  upVotes : number;
  downVotes:number;
}

const Analysis: React.FC<AnalysisProps> = ({title, viewCount, viewerCountry, viewDate, comments,upVotes,downVotes }) => {
  // Data for charts
  const viewCountData = {
    labels: viewDate,
    datasets: [
      {
        label: 'View Count',
        data: viewCount,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  };

  const countryData = {
    labels: Object.keys(viewerCountry),
    datasets: [
      {
        label: 'Viewers by Country',
        data: Object.values(viewerCountry),
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: { color: 'white' },
      },
      y: {
        ticks: { color: 'white' },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      }
    },
  };

  return (
    <div className="max-w-7xl h-screen mx-auto p-6 bg-gradient-to-br from-[#E2DFD0]/0 to-[#E2DFD0]/0 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 overflow-y-scroll scrollbar-thumb-rounded  text-white rounded-lg ">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">{title}</h2>
      <div className="flex flex-wrap justify-around mb-6">
      <div className="w-full md:w-1/2 lg:w-1/3 p-2">
          <h3 className="text-lg font-semibold mb-2">View Count Over Time</h3>
          <Line data={viewCountData} options={chartOptions} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-2">
          <h3 className="text-lg font-semibold mb-2">Viewers by Country</h3>
          <Bar data={countryData} options={chartOptions} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200">Date</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">View Count</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Comments</th>
            </tr>
          </thead>
          <tbody>
            {viewDate.map((date, index) => (
              <tr key={date}>
                <td className="px-4 py-2 border-b border-gray-300">{date}</td>
                <td className="px-4 py-2 border-b border-gray-300">{viewCount[index]}</td>
                <td className="px-4 py-2 border-b border-gray-300">{comments[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center justify-center mt-6">
        <div className="text-lg flex gap-x-1 justify-center">Upvotes <ArrowBigUp color='green' fill='green'/>: {upVotes}</div>
        <div className="text-lg flex gap-x-1 justify-center">Downvotes <ArrowBigDown color='red' fill='red'/>: {downVotes}</div>
      </div>
    </div>
  );
};

export default Analysis;
