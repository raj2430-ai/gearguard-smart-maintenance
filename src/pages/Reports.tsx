import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Wrench,
  Calendar,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', corrective: 12, preventive: 8 },
  { month: 'Feb', corrective: 15, preventive: 10 },
  { month: 'Mar', corrective: 10, preventive: 12 },
  { month: 'Apr', corrective: 8, preventive: 14 },
  { month: 'May', corrective: 14, preventive: 11 },
  { month: 'Jun', corrective: 11, preventive: 15 },
  { month: 'Jul', corrective: 9, preventive: 13 },
  { month: 'Aug', corrective: 13, preventive: 12 },
  { month: 'Sep', corrective: 7, preventive: 16 },
  { month: 'Oct', corrective: 10, preventive: 14 },
  { month: 'Nov', corrective: 12, preventive: 13 },
  { month: 'Dec', corrective: 6, preventive: 10 },
];

const statusDistribution = [
  { name: 'Completed', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'In Progress', value: 25, color: 'hsl(217, 91%, 60%)' },
  { name: 'New', value: 20, color: 'hsl(215, 16%, 47%)' },
  { name: 'Scrapped', value: 10, color: 'hsl(0, 84%, 60%)' },
];

const responseTimeData = [
  { day: 'Mon', time: 4.2 },
  { day: 'Tue', time: 3.8 },
  { day: 'Wed', time: 5.1 },
  { day: 'Thu', time: 3.5 },
  { day: 'Fri', time: 4.0 },
  { day: 'Sat', time: 2.8 },
  { day: 'Sun', time: 2.2 },
];

const Reports = () => {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights into your maintenance operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Requests"
          value="127"
          icon={<Wrench className="h-5 w-5" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Avg. Resolution Time"
          value="4.2h"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 8, direction: 'down' }}
        />
        <StatCard
          title="Completion Rate"
          value="94%"
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: 3, direction: 'up' }}
          iconClassName="bg-status-repaired-bg text-status-repaired group-hover:bg-status-repaired group-hover:text-primary-foreground"
        />
        <StatCard
          title="Equipment Uptime"
          value="98.5%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 1, direction: 'up' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Requests Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Requests</h3>
              <p className="text-sm text-muted-foreground">Corrective vs Preventive</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="corrective" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} name="Corrective" />
                <Bar dataKey="preventive" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Preventive" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Status Distribution</h3>
              <p className="text-sm text-muted-foreground">Current request breakdown</p>
            </div>
          </div>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Average Response Time</h3>
            <p className="text-sm text-muted-foreground">Hours to first response by day of week</p>
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit="h" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}h`, 'Response Time']}
              />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
