import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import type { LeaveRequest } from "./LeaveRequestForm";

interface AnalyticsDashboardProps {
  requests: LeaveRequest[];
}

export const AnalyticsDashboard = ({ requests }: AnalyticsDashboardProps) => {
  // Status distribution data
  const statusData = [
    {
      name: "Pending",
      value: requests.filter(r => r.status === 'pending').length,
      color: "hsl(var(--warning))"
    },
    {
      name: "Approved",
      value: requests.filter(r => r.status === 'approved').length,
      color: "hsl(var(--success))"
    },
    {
      name: "Rejected",
      value: requests.filter(r => r.status === 'rejected').length,
      color: "hsl(var(--destructive))"
    }
  ];

  // Classification data
  const classificationData = [
    {
      name: "Leave",
      count: requests.filter(r => r.classification === 'leave').length
    },
    {
      name: "Expense",
      count: requests.filter(r => r.classification === 'expense').length
    },
    {
      name: "Transfer",
      count: requests.filter(r => r.classification === 'transfer').length
    }
  ];

  // Leave type data
  const leaveTypeData = requests.reduce((acc, request) => {
    const existing = acc.find(item => item.type === request.type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: request.type, count: 1 });
    }
    return acc;
  }, [] as { type: string; count: number }[]);

  // Monthly trends (mock data for demo)
  const monthlyData = [
    { month: "Jan", requests: 12, approved: 10 },
    { month: "Feb", requests: 19, approved: 16 },
    { month: "Mar", requests: 15, approved: 12 },
    { month: "Apr", requests: 22, approved: 18 },
    { month: "May", requests: 18, approved: 15 },
    { month: "Jun", requests: requests.length, approved: requests.filter(r => r.status === 'approved').length }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {requests.length > 0 
                    ? Math.round((requests.filter(r => r.status === 'approved').length / requests.length) * 100)
                    : 0}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{requests.length}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Request Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Types */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(var(--primary))" name="Total Requests" />
                <Bar dataKey="approved" fill="hsl(var(--success))" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};