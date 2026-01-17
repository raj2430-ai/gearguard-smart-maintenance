import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  new: { label: 'New', icon: Clock, className: 'status-new' },
  in_progress: { label: 'In Progress', icon: Wrench, className: 'status-progress' },
  repaired: { label: 'Repaired', icon: CheckCircle2, className: 'status-repaired' },
  scrap: { label: 'Scrapped', icon: XCircle, className: 'status-scrap' },
};

export const RequestDetailSheet = ({ request, open, onOpenChange }) => {
  if (!request) return null;

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              request.status === 'scrap' ? "bg-destructive/10" : "bg-primary/10"
            )}>
              <StatusIcon className={cn(
                "h-5 w-5",
                request.status === 'scrap' ? "text-destructive" : "text-primary"
              )} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold text-left">
                {request.subject}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("status-badge", status.className)}>
                  {status.label}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs border-0",
                    request.type === 'corrective' 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
                </Badge>
                {request.isOverdue && request.status !== 'repaired' && request.status !== 'scrap' && (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Description */}
        {request.description && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
        )}

        {/* Equipment Info */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Equipment</h4>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{request.equipment.name}</p>
                <p className="text-xs text-muted-foreground">{request.equipment.serialNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{request.equipment.location}</p>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Assignment</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {request.assignedTechnician.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{request.assignedTechnician.name}</p>
                <p className="text-xs text-muted-foreground">Technician</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{request.team.name}</p>
                <p className="text-xs text-muted-foreground">Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm font-medium">{format(request.createdAt, 'MMM d, yyyy')}</span>
            </div>
            {request.scheduledDate && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="text-sm font-medium">{format(request.scheduledDate, 'MMM d, yyyy')}</span>
              </div>
            )}
            {request.completedAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">{format(request.completedAt, 'MMM d, yyyy')}</span>
              </div>
            )}
            {request.duration && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium">
                  {Math.floor(request.duration / 60)}h {request.duration % 60}m
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Edit Request
          </Button>
          <Button className="flex-1">
            Update Status
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
