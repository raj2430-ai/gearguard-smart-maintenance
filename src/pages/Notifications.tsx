import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Bell, 
  BellOff,
  Check, 
  Trash2, 
  AlertTriangle, 
  Wrench, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'assigned' | 'overdue' | 'completed' | 'status' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assigned',
      title: 'New Request Assigned',
      message: 'You have been assigned to "Motor overheating issue" on CNC Machine A',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      actionUrl: '/maintenance',
    },
    {
      id: '2',
      type: 'overdue',
      title: 'Overdue Maintenance',
      message: 'Preventive maintenance for Assembly Robot B is 2 days overdue',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionUrl: '/maintenance',
    },
    {
      id: '3',
      type: 'completed',
      title: 'Maintenance Completed',
      message: 'Mike Johnson completed repair on Hydraulic Press C',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Scheduled Maintenance',
      message: 'Reminder: Preventive maintenance for Conveyor Belt D is scheduled for tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      actionUrl: '/calendar',
    },
    {
      id: '5',
      type: 'status',
      title: 'Status Update',
      message: 'Request "Replace worn bearings" has been moved to In Progress',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assigned': return <Wrench className="h-5 w-5 text-primary" />;
      case 'overdue': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-status-repaired" />;
      case 'status': return <Clock className="h-5 w-5 text-status-progress" />;
      case 'reminder': return <Calendar className="h-5 w-5 text-primary" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    toast.success('Selected notifications deleted');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedIds.includes(notification.id)}
                        onCheckedChange={() => toggleSelect(notification.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div 
                        className="flex-1 flex gap-4" 
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-2">
            {notifications.filter(n => !n.read).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-status-repaired mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">All caught up!</h3>
                  <p className="text-muted-foreground">No unread notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.filter(n => !n.read).map((notification) => (
                <Card 
                  key={notification.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50 border-l-4 border-l-primary"
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedIds.includes(notification.id)}
                        onCheckedChange={() => toggleSelect(notification.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div 
                        className="flex-1 flex gap-4"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge variant="default" className="text-xs">New</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Notifications;
