import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { UserDashboard } from "@/pages/UserDashboard";
import { AdminPage } from "@/pages/Admin";
import type { LeaveRequest } from "@/components/LeaveRequestForm";

type UserRole = 'user' | 'admin' | null;

const Index = () => {
  const [user, setUser] = useState<{ role: UserRole; username: string } | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hrUser');
    const savedRequests = localStorage.getItem('hrRequests');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedRequests) {
      const requests = JSON.parse(savedRequests);
      // Convert submittedAt strings back to Date objects
      const requestsWithDates = requests.map((req: any) => ({
        ...req,
        submittedAt: new Date(req.submittedAt)
      }));
      setLeaveRequests(requestsWithDates);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('hrUser', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hrRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const handleLogin = (role: UserRole, username: string) => {
    setUser({ role, username });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hrUser');
  };

  const handleSubmitRequest = (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const handleUpdateRequest = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status } : req
      )
    );
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminPage
        username={user.username}
        requests={leaveRequests}
        onUpdateRequest={handleUpdateRequest}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <UserDashboard
      username={user.username}
      requests={leaveRequests}
      onSubmitRequest={handleSubmitRequest}
      onLogout={handleLogout}
    />
  );
};

export default Index;
