import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  classification: 'leave' | 'expense' | 'transfer';
}

interface LeaveRequestFormProps {
  employeeName: string;
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void;
}

export const LeaveRequestForm = ({ employeeName, onSubmit }: LeaveRequestFormProps) => {
  const [formData, setFormData] = useState({
    type: '',
    reason: '',
    startDate: '',
    endDate: ''
  });
  const { toast } = useToast();

  const classifyRequest = (reason: string): 'leave' | 'expense' | 'transfer' => {
    const lowerReason = reason.toLowerCase();
    
    if (lowerReason.includes('expense') || lowerReason.includes('reimbursement') || lowerReason.includes('travel cost')) {
      return 'expense';
    }
    
    if (lowerReason.includes('transfer') || lowerReason.includes('department') || lowerReason.includes('role change')) {
      return 'transfer';
    }
    
    return 'leave';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.reason || !formData.startDate || !formData.endDate) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const classification = classifyRequest(formData.reason);
    
    onSubmit({
      employeeName,
      type: formData.type,
      reason: formData.reason,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'pending',
      classification
    });

    toast({
      title: "Request Submitted",
      description: "Your leave request has been submitted successfully.",
    });

    // Reset form
    setFormData({
      type: '',
      reason: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Submit Leave Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Leave Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
                <SelectItem value="bereavement">Bereavement Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};