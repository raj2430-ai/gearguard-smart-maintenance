import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { CreateRequestModal } from '@/components/maintenance/CreateRequestModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { maintenanceRequests as initialRequests } from '@/data/mockData';
import { MaintenanceRequest, MaintenanceStatus, MaintenanceType } from '@/types/maintenance';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleUpdateStatus = (id: string, newStatus: MaintenanceStatus) => {
    setRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.equipment.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all maintenance requests
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="corrective">Corrective</SelectItem>
            <SelectItem value="preventive">Preventive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard requests={filteredRequests} onUpdateStatus={handleUpdateStatus} />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Subject</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Equipment</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Technician</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {request.isOverdue && request.status !== 'repaired' && request.status !== 'scrap' && (
                          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        )}
                        <span className="font-medium">{request.subject}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{request.equipment.name}</td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs border-0 capitalize",
                          request.type === 'corrective' 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {request.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={cn(
                        "status-badge capitalize",
                        request.status === 'new' && "status-new",
                        request.status === 'in_progress' && "status-progress",
                        request.status === 'repaired' && "status-repaired",
                        request.status === 'scrap' && "status-scrap"
                      )}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {request.assignedTechnician.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{request.assignedTechnician.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {format(request.createdAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateRequestModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </MainLayout>
  );
};

export default Maintenance;
