import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Wrench, 
  Users, 
  Edit2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { equipment, maintenanceRequests } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusStyles = {
  operational: 'bg-status-repaired-bg text-status-repaired',
  maintenance: 'bg-status-progress-bg text-status-progress',
  offline: 'bg-status-scrap-bg text-status-scrap',
};

const EquipmentDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get('tab') || 'overview';

  const item = equipment.find(e => e.id === id);
  
  if (!item) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">Equipment not found</h2>
          <Button variant="outline" onClick={() => navigate('/equipment')}>
            Back to Equipment
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get related maintenance requests
  const relatedRequests = maintenanceRequests.filter(r => r.equipment.id === item.id);
  const openRequests = relatedRequests.filter(r => r.status !== 'repaired' && r.status !== 'scrap');

  return (
    <MainLayout>
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4 -ml-2"
        onClick={() => navigate('/equipment')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Equipment
      </Button>

      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-primary/10">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
                <Badge className={cn("status-badge capitalize", statusStyles[item.status])}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{item.serialNumber}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Category: {item.category}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {item.openRequestsCount > 0 && (
              <Badge className="equipment-badge text-sm px-3 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                {item.openRequestsCount} Open Request{item.openRequestsCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Button variant="outline" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            Maintenance
            {openRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {openRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignment Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Assignment</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {item.assignedTechnician.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.assignedTechnician.name}</p>
                    <p className="text-sm text-muted-foreground">Primary Technician</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.maintenanceTeam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.maintenanceTeam.members.length} members
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Schedule Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Maintenance Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Last Maintenance</span>
                  <span className="font-medium">
                    {item.lastMaintenance 
                      ? format(item.lastMaintenance, 'MMM d, yyyy')
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Next Scheduled</span>
                  <span className="font-medium">
                    {item.nextScheduledMaintenance 
                      ? format(item.nextScheduledMaintenance, 'MMM d, yyyy')
                      : 'Not scheduled'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Maintenance Requests ({relatedRequests.length})
          </h3>
          
          {relatedRequests.length > 0 ? (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {relatedRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{request.subject}</h4>
                          {request.isOverdue && request.status !== 'repaired' && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs border-0",
                              request.type === 'corrective' 
                                ? "bg-amber-100 text-amber-700" 
                                : "bg-blue-100 text-blue-700"
                            )}
                          >
                            {request.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(request.createdAt, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn(
                        "status-badge capitalize",
                        request.status === 'new' && "status-new",
                        request.status === 'in_progress' && "status-progress",
                        request.status === 'repaired' && "status-repaired",
                        request.status === 'scrap' && "status-scrap"
                      )}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Wrench className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No maintenance requests for this equipment</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="flex flex-col items-center justify-center py-12 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Maintenance history will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default EquipmentDetail;
