import { MaintenanceRequest } from '@/types/maintenance';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface KanbanCardProps {
  request: MaintenanceRequest;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}

export const KanbanCard = ({ 
  request, 
  isDragging, 
  onDragStart, 
  onDragEnd,
  onClick 
}: KanbanCardProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, request.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "kanban-card relative",
        isDragging && "dragging",
        request.status === 'scrap' && "opacity-75 bg-status-scrap-bg/30"
      )}
    >
      {/* Overdue indicator */}
      {request.isOverdue && request.status !== 'repaired' && request.status !== 'scrap' && (
        <div className="overdue-indicator" title="Overdue" />
      )}

      {/* Subject */}
      <h4 className="font-semibold text-sm text-foreground mb-2 pr-4 line-clamp-2">
        {request.subject}
      </h4>

      {/* Equipment name */}
      <p className="text-xs text-muted-foreground mb-3">
        {request.equipment.name}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] font-medium border-0",
            request.type === 'corrective' 
              ? "bg-amber-100 text-amber-700" 
              : "bg-blue-100 text-blue-700"
          )}
        >
          {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
        </Badge>
        
        {request.priority === 'critical' && (
          <Badge variant="destructive" className="text-[10px] font-medium gap-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            Critical
          </Badge>
        )}

        {request.status === 'scrap' && (
          <Badge className="text-[10px] font-medium bg-destructive/10 text-destructive border-0">
            Scrapped
          </Badge>
        )}
      </div>

      {/* Bottom row: Avatar + Date/Duration */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
            {request.assignedTechnician.avatar}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {request.type === 'preventive' && request.scheduledDate && request.status !== 'repaired' && (
            <>
              <Calendar className="h-3 w-3" />
              <span>{format(request.scheduledDate, 'MMM d')}</span>
            </>
          )}

          {request.status === 'repaired' && request.duration && (
            <>
              <Clock className="h-3 w-3" />
              <span>{formatDuration(request.duration)}</span>
            </>
          )}

          {!request.scheduledDate && request.status !== 'repaired' && (
            <span>{format(request.createdAt, 'MMM d')}</span>
          )}
        </div>
      </div>
    </div>
  );
};
