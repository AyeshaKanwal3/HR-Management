import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Calendar, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LeaveRequest } from "./LeaveRequestForm";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

interface AdminDashboardProps {
  requests: LeaveRequest[];
  onUpdateRequest: (id: string, status: 'approved' | 'rejected') => void;
}

export const AdminDashboard = ({ requests, onUpdateRequest }: AdminDashboardProps) => {
  const { toast } = useToast();

  const handleApprove = (id: string, employeeName: string) => {
    onUpdateRequest(id, 'approved');
    toast({
      title: "Request Approved",
      description: `${employeeName}'s leave request has been approved.`,
    });
  };

  const handleReject = (id: string, employeeName: string) => {
    onUpdateRequest(id, 'rejected');
    toast({
      title: "Request Rejected",
      description: `${employeeName}'s leave request has been rejected.`,
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getClassificationBadge = (classification: string) => {
    const colors = {
      leave: 'bg-primary text-primary-foreground',
      expense: 'bg-warning text-warning-foreground',
      transfer: 'bg-accent text-accent-foreground'
    };
    
    return (
      <Badge className={colors[classification as keyof typeof colors] || 'bg-muted text-muted-foreground'}>
        {classification.charAt(0).toUpperCase() + classification.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Requests
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests Management</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests submitted yet.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Classification</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.employeeName}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{getClassificationBadge(request.classification)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(request.startDate).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">to {new Date(request.endDate).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request.id, request.employeeName)}
                                  className="bg-success hover:bg-success/90 text-success-foreground"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(request.id, request.employeeName)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard requests={requests} />
        </TabsContent>
      </Tabs>
    </div>
  );
};