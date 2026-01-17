import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

export const MaintenanceCalendar = ({ requests, onDateClick, onRequestClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Filter only preventive maintenance requests
  const preventiveRequests = requests.filter(r => r.type === 'preventive' && r.scheduledDate);

  const getRequestsForDate = (date) => {
    return preventiveRequests.filter(r => r.scheduledDate && isSameDay(r.scheduledDate, date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate empty cells at start
  const startDay = monthStart.getDay();
  const emptyCells = Array(startDay).fill(null);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            {['month', 'week', 'day'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "px-3 capitalize",
                  viewMode === mode && "shadow-sm"
                )}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells */}
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] bg-muted/20 rounded-lg" />
          ))}

          {/* Day cells */}
          {daysInMonth.map((day) => {
            const dayRequests = getRequestsForDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateClick(day)}
                className={cn(
                  "min-h-[120px] p-2 rounded-lg border border-transparent cursor-pointer transition-all",
                  "hover:border-primary/30 hover:bg-primary/5",
                  isToday && "bg-primary/5 border-primary/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayRequests.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      {dayRequests.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayRequests.slice(0, 2).map((request) => (
                    <div
                      key={request.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestClick(request);
                      }}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded text-xs transition-colors"
                    >
                      <p className="font-medium text-blue-700 truncate">{request.subject}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="bg-blue-200 text-blue-700 text-[8px]">
                            {request.assignedTechnician.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-blue-600 truncate">
                          {request.equipment.name}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayRequests.length > 2 && (
                    <button className="w-full text-[10px] text-muted-foreground hover:text-foreground py-1">
                      +{dayRequests.length - 2} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
            <span>Preventive Maintenance</span>
          </div>
          <span>•</span>
          <span>Click any date to create a new preventive maintenance request</span>
        </div>
      </div>
    </div>
  );
};
