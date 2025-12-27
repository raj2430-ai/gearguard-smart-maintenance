import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Wrench,
  CheckCircle2,
  Clock,
  TrendingUp,
  Settings,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  const stats = {
    completedTasks: 156,
    avgResponseTime: '2.4 hrs',
    satisfactionRate: 98,
    activeRequests: 5,
  };

  const recentActivity = [
    { id: 1, action: 'Completed maintenance', equipment: 'CNC Machine A', time: '2 hours ago' },
    { id: 2, action: 'Started repair', equipment: 'Assembly Robot B', time: '5 hours ago' },
    { id: 3, action: 'Created request', equipment: 'Hydraulic Press C', time: '1 day ago' },
    { id: 4, action: 'Completed inspection', equipment: 'Conveyor Belt D', time: '2 days ago' },
  ];

  const achievements = [
    { name: 'Quick Responder', description: 'Average response time under 1 hour', icon: Clock, earned: true },
    { name: 'Task Master', description: 'Complete 100+ maintenance tasks', icon: CheckCircle2, earned: true },
    { name: 'Efficiency Expert', description: 'Maintain 95%+ satisfaction rate', icon: TrendingUp, earned: true },
    { name: 'Equipment Specialist', description: 'Work on 50+ unique equipment', icon: Wrench, earned: false },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
                  <Badge>Admin</Badge>
                  <Badge variant="outline" className="text-status-repaired border-status-repaired">
                    Active
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">Maintenance Manager</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    john.doe@gearguard.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    +1 (555) 123-4567
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Building A, Floor 2
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined Jan 2023
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button onClick={() => navigate('/settings')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stats.completedTasks}</div>
              <p className="text-sm text-muted-foreground mt-1">Completed Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-status-progress">{stats.avgResponseTime}</div>
              <p className="text-sm text-muted-foreground mt-1">Avg Response</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-status-repaired">{stats.satisfactionRate}%</div>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-foreground">{stats.activeRequests}</div>
              <p className="text-sm text-muted-foreground mt-1">Active Requests</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.equipment}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.name}
                      className={`p-4 rounded-lg border transition-colors ${
                        achievement.earned 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-muted/50 border-border opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <achievement.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { skill: 'CNC Machines', level: 95 },
                  { skill: 'Industrial Robotics', level: 88 },
                  { skill: 'Hydraulic Systems', level: 82 },
                  { skill: 'Electrical Systems', level: 75 },
                  { skill: 'Conveyor Systems', level: 90 },
                ].map((item) => (
                  <div key={item.skill} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.skill}</span>
                      <span className="text-muted-foreground">{item.level}%</span>
                    </div>
                    <Progress value={item.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
