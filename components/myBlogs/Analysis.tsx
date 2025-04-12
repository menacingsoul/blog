'use client'
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Users, Eye, Calendar, MessageSquare, PieChart } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisProps {
  title: string;
  viewCount: number[];
  viewerCountry: { [key: string]: number };
  viewDate: string[];
  comments: number[];
  upVotes: number;
  downVotes: number;
}

const Analysis = ({
  title = "Video Analytics",
  viewCount = [],
  viewerCountry = {},
  viewDate = [],
  comments = [],
  upVotes = 0,
  downVotes = 0
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate total views
  const totalViews = viewCount.reduce((sum, count) => sum + count, 0);
  
  // Calculate engagement rate: (upvotes + downvotes + comments) / views
  const totalComments = comments.reduce((sum, count) => sum + count, 0);
  const engagement = ((upVotes + downVotes + totalComments) / totalViews * 100).toFixed(1);
  
  // Data for line chart - views over time
  const viewCountData = {
    labels: viewDate,
    datasets: [
      {
        label: 'Views',
        data: viewCount,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Comments',
        data: comments,
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Data for bar chart - viewers by country
  const countryData = {
    labels: Object.keys(viewerCountry).slice(0, 5),
    datasets: [
      {
        label: 'Viewers by Country',
        data: Object.values(viewerCountry).slice(0, 5),
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Data for doughnut chart - votes
  const voteData = {
    labels: ['Upvotes', 'Downvotes'],
    datasets: [
      {
        data: [upVotes, downVotes],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: { 
          color: 'white',
          maxRotation: 45,
          minRotation: 45
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: { 
          color: 'white' 
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        },
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 10,
        cornerRadius: 6,
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        },
        position: 'bottom',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 10,
        cornerRadius: 6,
      }
    },
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg z-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-400">Performance analytics and statistics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button 
          className={`pb-2 px-1 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`pb-2 px-1 ${activeTab === 'demographics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('demographics')}
        >
          Demographics
        </button>
        <button 
          className={`pb-2 px-1 ${activeTab === 'engagement' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('engagement')}
        >
          Engagement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg flex items-center">
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full mr-4">
            <Eye size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Views</p>
            <p className="text-xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg flex items-center">
          <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full mr-4">
            <MessageSquare size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Comments</p>
            <p className="text-xl font-bold">{totalComments.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg flex items-center">
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-full mr-4">
            <Users size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Countries</p>
            <p className="text-xl font-bold">{Object.keys(viewerCountry).length}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg flex items-center">
          <div className="bg-pink-500 bg-opacity-20 p-3 rounded-full mr-4">
            <PieChart size={20} className="text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Engagement Rate</p>
            <p className="text-xl font-bold">{engagement}%</p>
          </div>
        </div>
      </div>

      {/* Main Content - Changes based on active tab */}
      {activeTab === 'overview' && (
        <>
          {/* Views Over Time Chart */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Views & Comments Over Time</h2>
            <div className="h-64">
              <Line data={viewCountData} options={chartOptions} />
            </div>
          </div>

          {/* Latest Activity Table */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-right">Views</th>
                    <th className="px-4 py-2 text-right">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {viewDate.slice(-5).map((date, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="px-4 py-3 text-left">{date}</td>
                      <td className="px-4 py-3 text-right">{viewCount[viewCount.length - 5 + index]}</td>
                      <td className="px-4 py-3 text-right">{comments[comments.length - 5 + index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'demographics' && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Top Viewer Countries</h2>
          <div className="h-64">
            <Bar data={countryData} options={chartOptions} />
          </div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg col-span-2">
            <h2 className="text-lg font-semibold mb-4">Engagement Metrics</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                <div className="mr-3">
                  <ArrowUp size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Upvotes</p>
                  <p className="text-xl font-bold">{upVotes.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                <div className="mr-3">
                  <ArrowDown size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Downvotes</p>
                  <p className="text-xl font-bold">{downVotes.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Engagement Rate Analysis</h3>
              <p className="text-gray-400 text-sm">
                Your content has an engagement rate of {engagement}%, which is 
                {parseInt(engagement) > 5 ? ' above' : ' below'} average for similar content.
                {parseInt(engagement) > 5 
                  ? ' This indicates strong audience interaction with your content.'
                  : ' Consider strategies to improve audience interaction with your content.'}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Vote Distribution</h2>
            <div className="h-48">
              <Doughnut data={voteData} options={doughnutOptions} />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                {upVotes > downVotes * 5 
                  ? 'Outstanding positive reception'
                  : upVotes > downVotes * 2
                    ? 'Strong positive reception'
                    : upVotes > downVotes
                      ? 'Positive reception'
                      : 'Mixed reception'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;