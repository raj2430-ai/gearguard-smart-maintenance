import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { RequestDetailSheet } from './RequestDetailSheet';

const columns = [
  { status: 'new', title: 'New' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'repaired', title: 'Repaired' },
  { status: 'scrap', title: 'Scrap' },
];

export const KanbanBoard = ({ requests, onUpdateStatus }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedId) {
      onUpdateStatus(draggedId, status);
    }
    setDraggedId(null);
    setDragOverStatus(null);
  };

  const getRequestsByStatus = (status) => {
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
