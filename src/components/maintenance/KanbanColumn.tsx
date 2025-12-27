import { MaintenanceRequest, MaintenanceStatus } from '@/types/maintenance';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: MaintenanceStatus;
  requests: MaintenanceRequest[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: MaintenanceStatus) => void;
  isDragOver: boolean;
  onCardClick: (request: MaintenanceRequest) => void;
}

const statusColors = {
  new: 'bg-muted-foreground',
  in_progress: 'bg-status-progress',
  repaired: 'bg-status-repaired',
  scrap: 'bg-status-scrap',
};

export const KanbanColumn = ({
  title,
  status,
  requests,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
  onCardClick,
}: KanbanColumnProps) => {
  return (
    <div
      className={cn(
        "kanban-column transition-all duration-200",
        isDragOver && "ring-2 ring-primary/30 ring-inset bg-primary/5"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3 flex-1 overflow-auto">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">No requests</p>
          </div>
        ) : (
          requests.map((request, index) => (
            <div 
              key={request.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <KanbanCard
                request={request}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={() => onCardClick(request)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
