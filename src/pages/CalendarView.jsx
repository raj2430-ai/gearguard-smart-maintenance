import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MaintenanceCalendar } from '@/components/calendar/MaintenanceCalendar';
import { CreateRequestModal } from '@/components/maintenance/CreateRequestModal';
import { RequestDetailSheet } from '@/components/maintenance/RequestDetailSheet';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { maintenanceRequests } from '@/data/mockData';

const CalendarView = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and track preventive maintenance activities
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          This calendar displays <strong>Preventive Maintenance</strong> requests only. 
          Click on any date to schedule a new preventive maintenance task.
        </p>
      </div>

      <MaintenanceCalendar 
        requests={maintenanceRequests}
        onDateClick={handleDateClick}
        onRequestClick={handleRequestClick}
      />

      <CreateRequestModal 
        open={isCreateModalOpen} 
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setSelectedDate(undefined);
        }}
        defaultDate={selectedDate}
      />

      <RequestDetailSheet
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </MainLayout>
  );
};

export default CalendarView;
