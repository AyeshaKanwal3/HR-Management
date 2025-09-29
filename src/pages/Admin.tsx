import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User } from "lucide-react";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { LeaveRequest } from "@/components/LeaveRequestForm";

interface AdminPageProps {
  username: string;
  requests: LeaveRequest[];
  onUpdateRequest: (id: string, status: 'approved' | 'rejected') => void;
  onLogout: () => void;
}

export const AdminPage = ({ username, requests, onUpdateRequest, onLogout }: AdminPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {username}</p>
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
        <AdminDashboard 
          requests={requests} 
          onUpdateRequest={onUpdateRequest}
        />
      </div>
    </div>
  );
};