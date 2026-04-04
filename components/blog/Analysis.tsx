'use client'
import React, { useState, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, Eye, MessageSquare, Globe, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
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
  Filler,
} from 'chart.js';
import { cn } from '@/lib/utils';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalysisProps {
  title: string;
  blogId: string;
  createdAt: Date;
  totalViews: number;
  viewCount: number[];
  viewDate: string[];
  viewerCountry: Record<string, number>;
  totalComments: number;
  upVotes: number;
  downVotes: number;
}

type TabKey = 'overview' | 'audience' | 'engagement';

const Analysis: React.FC<AnalysisProps> = ({
  title,
  blogId,
  createdAt,
  totalViews,
  viewCount,
  viewDate,
  viewerCountry,
  totalComments,
  upVotes,
  downVotes,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const totalVotes = upVotes + downVotes;
  const engagementRate = totalViews > 0
    ? ((totalVotes + totalComments) / totalViews * 100).toFixed(1)
    : '0.0';

  // Format dates for chart labels
  const formattedDates = useMemo(() =>
    viewDate.map(d => {
      const date = new Date(d);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }),
    [viewDate]
  );

  // Sort countries by count descending
  const sortedCountries = useMemo(() =>
    Object.entries(viewerCountry)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8),
    [viewerCountry]
  );

  // Use CSS variable-aware colors
  const primaryColor = 'hsl(262, 83%, 58%)';
  const primaryAlpha = 'hsla(262, 83%, 58%, 0.15)';
  const emeraldColor = 'hsl(152, 69%, 45%)';
  const destructiveColor = 'hsl(0, 84%, 60%)';

  // Chart: Views over time
  const viewsChartData = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Views',
        data: viewCount,
        borderColor: primaryColor,
        backgroundColor: primaryAlpha,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: primaryColor,
        pointRadius: viewCount.length > 20 ? 0 : 3,
        pointHoverRadius: 5,
      },
    ],
  };

  // Chart: Countries bar
  const countryChartData = {
    labels: sortedCountries.map(([name]) => name),
    datasets: [
      {
        label: 'Readers',
        data: sortedCountries.map(([, count]) => count),
        backgroundColor: [
          'hsla(262, 83%, 58%, 0.75)',
          'hsla(220, 83%, 58%, 0.75)',
          'hsla(152, 69%, 45%, 0.75)',
          'hsla(40, 96%, 53%, 0.75)',
          'hsla(330, 81%, 60%, 0.75)',
          'hsla(190, 80%, 50%, 0.75)',
          'hsla(280, 65%, 55%, 0.75)',
          'hsla(15, 80%, 55%, 0.75)',
        ],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  // Chart: Votes doughnut
  const voteChartData = {
    labels: ['Likes', 'Dislikes'],
    datasets: [
      {
        data: [upVotes, downVotes],
        backgroundColor: [emeraldColor, destructiveColor],
        borderWidth: 0,
        spacing: 2,
      },
    ],
  };

  // Shared chart options — theme-aware
  const getGridColor = () => 'rgba(128, 128, 128, 0.12)';
  const getTickColor = () => 'rgba(128, 128, 128, 0.7)';

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: getTickColor(), font: { size: 11 }, maxTicksLimit: 10 },
        border: { display: false },
      },
      y: {
        grid: { color: getGridColor() },
        ticks: { color: getTickColor(), font: { size: 11 }, precision: 0 },
        border: { display: false },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 12 },
        bodyFont: { size: 13, weight: '600' },
      },
    },
  };

  const barOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: { color: getGridColor() },
        ticks: { color: getTickColor(), font: { size: 11 }, precision: 0 },
        border: { display: false },
        beginAtZero: true,
      },
      y: {
        grid: { display: false },
        ticks: { color: getTickColor(), font: { size: 12 } },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'audience', label: 'Audience' },
    { key: 'engagement', label: 'Engagement' },
  ];

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[34px] font-extrabold text-foreground tracking-tight leading-tight mb-2">
          Story stats
        </h1>
        <Link
          href={`/blog/viewer/${blogId}`}
          className="text-primary hover:underline text-[15px] font-medium line-clamp-1"
        >
          {title}
        </Link>
        <p className="text-muted-foreground text-sm mt-1">
          Published {formatDate(createdAt)}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<Eye size={18} />} label="Views" value={totalViews} />
        <StatCard icon={<MessageSquare size={18} />} label="Responses" value={totalComments} />
        <StatCard icon={<ThumbsUp size={18} />} label="Likes" value={upVotes} />
        <StatCard icon={<TrendingUp size={18} />} label="Engagement" value={`${engagementRate}%`} />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Views over time */}
          <div className="border border-border rounded-xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-1">Views over time</h2>
            <p className="text-muted-foreground text-sm mb-6">Daily readership for this story</p>
            {viewCount.length > 0 ? (
              <div className="h-[280px] sm:h-[320px]">
                <Line data={viewsChartData} options={lineOptions} />
              </div>
            ) : (
              <EmptyState message="No views data yet" />
            )}
          </div>

          {/* Recent activity table */}
          {viewDate.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Recent activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-5 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewDate.slice().reverse().slice(0, 7).map((date, index) => {
                      const originalIndex = viewDate.length - 1 - index;
                      return (
                        <tr key={date} className="border-b border-border/50 last:border-0">
                          <td className="px-5 sm:px-6 py-3.5 text-sm text-foreground">
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-sm text-foreground text-right font-medium">
                            {viewCount[originalIndex]?.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Audience tab ── */}
      {activeTab === 'audience' && (
        <div className="space-y-8">
          {/* Countries chart */}
          <div className="border border-border rounded-xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-1">Reader locations</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Top countries your readers are from
            </p>
            {sortedCountries.length > 0 ? (
              <div style={{ height: Math.max(180, sortedCountries.length * 40) }}>
                <Bar data={countryChartData} options={barOptions} />
              </div>
            ) : (
              <EmptyState message="No location data available" />
            )}
          </div>

          {/* Country breakdown list */}
          {sortedCountries.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Country breakdown</h2>
              </div>
              <div className="divide-y divide-border/50">
                {sortedCountries.map(([country, count]) => (
                  <div key={country} className="px-5 sm:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{count}</span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {totalViews > 0 ? ((count / totalViews) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Engagement tab ── */}
      {activeTab === 'engagement' && (
        <div className="space-y-8">
          {/* Vote summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Reactions</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-emerald-500/10">
                    <ThumbsUp size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{upVotes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-destructive/10">
                    <ThumbsDown size={18} className="text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{downVotes}</p>
                    <p className="text-xs text-muted-foreground">Dislikes</p>
                  </div>
                </div>
              </div>
              {totalVotes > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Like ratio</span>
                    <span>{((upVotes / totalVotes) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(upVotes / totalVotes) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vote distribution doughnut */}
            <div className="border border-border rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold text-foreground mb-4 self-start">Distribution</h2>
              {totalVotes > 0 ? (
                <>
                  <div className="h-[160px] w-[160px] relative">
                    <Doughnut data={voteChartData} options={doughnutOptions} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{totalVotes}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted-foreground">Likes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                      <span className="text-xs text-muted-foreground">Dislikes</span>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState message="No votes yet" />
              )}
            </div>
          </div>

          {/* Engagement summary */}
          <div className="border border-border rounded-xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Engagement summary</h2>
            <div className="space-y-4">
              <EngagementRow
                label="Engagement rate"
                value={`${engagementRate}%`}
                description="(Likes + Dislikes + Responses) / Views"
              />
              <EngagementRow
                label="Total interactions"
                value={(totalVotes + totalComments).toLocaleString()}
                description="All reactions and responses combined"
              />
              <EngagementRow
                label="Responses"
                value={totalComments.toLocaleString()}
                description="Total comments on this story"
              />
              {totalVotes > 0 && (
                <EngagementRow
                  label="Sentiment"
                  value={
                    upVotes > downVotes * 5
                      ? 'Overwhelmingly positive'
                      : upVotes > downVotes * 2
                        ? 'Very positive'
                        : upVotes > downVotes
                          ? 'Positive'
                          : upVotes === downVotes
                            ? 'Mixed'
                            : 'Needs improvement'
                  }
                  description={`${upVotes} likes vs ${downVotes} dislikes`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-components ──

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function EngagementRow({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <p className="text-sm font-bold text-foreground ml-4 shrink-0">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
      <p>{message}</p>
    </div>
  );
}

export default Analysis;