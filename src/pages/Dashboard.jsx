import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { CreateRequestModal } from '@/components/maintenance/CreateRequestModal';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, ClipboardList, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { maintenanceRequests as initialRequests, dashboardStats } from '@/data/mockData';

const Dashboard = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleUpdateStatus = (id, newStatus) => {
    setRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of maintenance operations and equipment status
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Equipment"
          value={dashboardStats.totalEquipment}
          icon={<Wrench className="h-5 w-5" />}
        />
        <StatCard
          title="Active Requests"
          value={dashboardStats.activeRequests}
          icon={<ClipboardList className="h-5 w-5" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Completed This Month"
          value={dashboardStats.completedThisMonth}
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: 8, direction: 'up' }}
          iconClassName="bg-status-repaired-bg text-status-repaired group-hover:bg-status-repaired group-hover:text-primary-foreground"
        />
        <StatCard
          title="Overdue"
          value={dashboardStats.overdueRequests}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconClassName="bg-status-scrap-bg text-status-scrap group-hover:bg-destructive group-hover:text-destructive-foreground"
        />
        <StatCard
          title="Upcoming Preventive"
          value={dashboardStats.upcomingPreventive}
          icon={<Calendar className="h-5 w-5" />}
          iconClassName="bg-status-progress-bg text-status-progress group-hover:bg-status-progress group-hover:text-primary-foreground"
        />
      </div>

      {/* Kanban Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Maintenance Board</h2>
          <div className="text-sm text-muted-foreground">
            Drag and drop to update status
          </div>
        </div>
        <KanbanBoard requests={requests} onUpdateStatus={handleUpdateStatus} />
      </div>

      <CreateRequestModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </MainLayout>
  );
};

export default Dashboard;
