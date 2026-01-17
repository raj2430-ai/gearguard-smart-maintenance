import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { equipment } from '@/data/mockData';

export const CreateRequestModal = ({ open, onOpenChange, defaultDate }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [requestType, setRequestType] = useState('corrective');
  const [scheduledDate, setScheduledDate] = useState(defaultDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Auto-fill team and technician when equipment is selected (Odoo onchange behavior)
  useEffect(() => {
    if (selectedEquipment) {
      // Team and technician are auto-filled from equipment
    }
  }, [selectedEquipment]);

  useEffect(() => {
    if (defaultDate) {
      setScheduledDate(defaultDate);
      setRequestType('preventive');
    }
  }, [defaultDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ subject, description, selectedEquipment, requestType, scheduledDate });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSubject('');
    setDescription('');
    setSelectedEquipment(null);
    setRequestType('corrective');
    setScheduledDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Maintenance Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Equipment Selector */}
          <div className="space-y-2">
            <Label>Equipment *</Label>
            <Select
              value={selectedEquipment?.id || ''}
              onValueChange={(value) => {
                const eq = equipment.find(e => e.id === value);
                setSelectedEquipment(eq || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {equipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    <div className="flex items-center gap-2">
                      <span>{eq.name}</span>
                      <span className="text-xs text-muted-foreground">({eq.location})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-filled Team & Technician (Odoo onchange behavior) */}
          {selectedEquipment && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maintenance Team</p>
                  <p className="text-sm font-medium">{selectedEquipment.maintenanceTeam.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {selectedEquipment.assignedTechnician.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Technician</p>
                  <p className="text-sm font-medium">{selectedEquipment.assignedTechnician.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Request Type */}
          <div className="space-y-2">
            <Label>Request Type *</Label>
            <Select value={requestType} onValueChange={(v) => setRequestType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                <SelectItem value="preventive">Preventive Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date (only for preventive) */}
          {requestType === 'preventive' && (
            <div className="space-y-2 animate-fade-in">
              <Label>Scheduled Date *</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={(date) => {
                      setScheduledDate(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
