export type MaintenanceStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type MaintenanceType = 'corrective' | 'preventive';

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  email: string;
  specialization?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  members: Technician[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'offline';
  maintenanceTeam: MaintenanceTeam;
  assignedTechnician: Technician;
  lastMaintenance?: Date;
  nextScheduledMaintenance?: Date;
  openRequestsCount: number;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  equipment: Equipment;
  type: MaintenanceType;
  status: MaintenanceStatus;
  assignedTechnician: Technician;
  team: MaintenanceTeam;
  scheduledDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  duration?: number; // in minutes
  isOverdue: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardStats {
  totalEquipment: number;
  activeRequests: number;
  completedThisMonth: number;
  overdueRequests: number;
  upcomingPreventive: number;
}
