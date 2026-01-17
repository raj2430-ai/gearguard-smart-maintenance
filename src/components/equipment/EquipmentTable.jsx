import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
  operational: 'bg-status-repaired-bg text-status-repaired',
  maintenance: 'bg-status-progress-bg text-status-progress',
  offline: 'bg-status-scrap-bg text-status-scrap',
};

export const EquipmentTable = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Equipment
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Assigned Team
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Open Requests
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {equipment.map((item, index) => (
              <tr 
                key={item.id} 
                className="hover:bg-muted/30 transition-colors animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/equipment/${item.id}`)}
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge className={cn("status-badge capitalize", statusStyles[item.status])}>
                    {item.status}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {item.assignedTechnician.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{item.assignedTechnician.name}</p>
                      <p className="text-xs text-muted-foreground">{item.maintenanceTeam.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {item.openRequestsCount > 0 ? (
                    <Badge 
                      className="equipment-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/equipment/${item.id}?tab=maintenance`);
                      }}
                    >
                      Maintenance ({item.openRequestsCount})
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/equipment/${item.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
