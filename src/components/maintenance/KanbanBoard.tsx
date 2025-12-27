import { useState } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '@/types/maintenance';
import { KanbanColumn } from './KanbanColumn';
import { RequestDetailSheet } from './RequestDetailSheet';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onUpdateStatus: (id: string, status: MaintenanceStatus) => void;
}

const columns: { status: MaintenanceStatus; title: string }[] = [
  { status: 'new', title: 'New' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'repaired', title: 'Repaired' },
  { status: 'scrap', title: 'Scrap' },
];

export const KanbanBoard = ({ requests, onUpdateStatus }: KanbanBoardProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<MaintenanceStatus | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e: React.DragEvent, status: MaintenanceStatus) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = (e: React.DragEvent, status: MaintenanceStatus) => {
    e.preventDefault();
    if (draggedId) {
      onUpdateStatus(draggedId, status);
    }
    setDraggedId(null);
    setDragOverStatus(null);
  };

  const getRequestsByStatus = (status: MaintenanceStatus) => {
    return requests.filter((r) => r.status === status);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            requests={getRequestsByStatus(column.status)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDrop={handleDrop}
            isDragOver={dragOverStatus === column.status}
            onCardClick={setSelectedRequest}
          />
        ))}
      </div>

      <RequestDetailSheet
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </>
  );
};
