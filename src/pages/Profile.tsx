import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  Edit,
  Camera,
  Save,
  X,
  Loader2,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    role: 'technician',
    avatar_url: '',
  });
  
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    
    if (data) {
      const profileData = {
        full_name: data.full_name || user.user_metadata?.full_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        department: data.department || '',
        role: data.role || 'technician',
        avatar_url: data.avatar_url || '',
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    } else {
      // Use user metadata if no profile exists
      const profileData = {
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        department: '',
        role: 'technician',
        avatar_url: '',
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    }
    
    setProfileLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        department: editedProfile.department,
      })
      .eq('user_id', user.id);
    
    if (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } else {
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getUserInitials = () => {
    if (profile.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (profile.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

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

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
          <CardContent className="pt-0 -mt-12">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedProfile.full_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                      placeholder="Your full name"
                      className="text-xl font-bold h-12 max-w-xs"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1">
                      <h1 className="text-2xl font-bold text-foreground">
                        {profile.full_name || 'Set your name'}
                      </h1>
                      <div className="flex gap-2">
                        <Badge className="capitalize">{profile.role}</Badge>
                        <Badge variant="outline" className="text-[hsl(var(--status-repaired))] border-[hsl(var(--status-repaired))]">
                          Active
                        </Badge>
                      </div>
                    </div>
                    {profile.department && (
                      <p className="text-muted-foreground">{profile.department}</p>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2 pb-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Contact Info */}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <Building className="h-4 w-4" /> Department
                  </Label>
                  <Input
                    id="department"
                    value={editedProfile.department}
                    onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                    placeholder="e.g., Maintenance, Operations"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                )}
                {profile.department && (
                  <span className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {profile.department}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user?.created_at)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-card to-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stats.completedTasks}</div>
              <p className="text-sm text-muted-foreground mt-1">Completed Tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-[hsl(var(--status-progress))]/5">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[hsl(var(--status-progress))]">{stats.avgResponseTime}</div>
              <p className="text-sm text-muted-foreground mt-1">Avg Response</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-[hsl(var(--status-repaired))]/5">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[hsl(var(--status-repaired))]">{stats.satisfactionRate}%</div>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-muted">
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
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
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
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
                <CardDescription>Milestones you've reached</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.name}
                      className={`p-4 rounded-xl border transition-all ${
                        achievement.earned 
                          ? 'bg-primary/5 border-primary/20 hover:shadow-md' 
                          : 'bg-muted/50 border-border opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          achievement.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold">{achievement.name}</p>
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
                <CardDescription>Your proficiency levels</CardDescription>
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
