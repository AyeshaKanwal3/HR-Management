import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, MessageCircle, FileText, Calendar, User } from "lucide-react";
import { HRChatbot } from "@/components/HRChatbot";
import { LeaveRequestForm, type LeaveRequest } from "@/components/LeaveRequestForm";

interface UserDashboardProps {
  username: string;
  requests: LeaveRequest[];
  onSubmitRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void;
  onLogout: () => void;
}

export const UserDashboard = ({ username, requests, onSubmitRequest, onLogout }: UserDashboardProps) => {
  const userRequests = requests.filter(r => r.employeeName === username);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Welcome back, {username}!</h1>
                <p className="text-sm text-muted-foreground">Employee Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chatbot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              HR Assistant
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Leave Request
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot">
            <div className="max-w-4xl mx-auto">
              <HRChatbot />
            </div>
          </TabsContent>

          <TabsContent value="request">
            <div className="max-w-2xl mx-auto">
              <LeaveRequestForm 
                employeeName={username} 
                onSubmit={onSubmitRequest}
              />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>My Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {userRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No leave requests submitted yet.</p>
                    <p className="text-sm">Use the "Leave Request" tab to submit your first request.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:bg-card-hover transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{request.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Submitted: {request.submittedAt.toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {request.classification}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};