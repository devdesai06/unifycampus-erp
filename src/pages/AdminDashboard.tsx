import { 
  Users, 
  DollarSign, 
  Home, 
  TrendingUp, 
  UserCheck, 
  BookOpen,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  MessageCircle
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { KpiCard } from "@/components/ui/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/useAuth"
import { useAdminData } from "@/hooks/useAdminData"

export default function AdminDashboard() {
  const { profile } = useAuth();
  const adminData = useAdminData();
  if (adminData.loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" userName={`${profile?.first_name} ${profile?.last_name}`} userEmail={profile?.email} />
      
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administrative Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all campus operations from here.</p>
        </div>

        {/* KPI Cards Row 1 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCard
            title="Total Students"
            value={adminData.totalStudents.toLocaleString()}
            icon={<Users />}
            variant="primary"
            trend={{ value: 12, isPositive: true, label: "vs last semester" }}
          />
          <KpiCard
            title="Fees Collected Today"
            value={`₹${(adminData.feesCollected / 1000).toFixed(0)}K`}
            icon={<DollarSign />}
            variant="success"
            trend={{ value: 8, isPositive: true, label: "vs yesterday" }}
          />
          <KpiCard
            title="Vacant Hostel Rooms"
            value={adminData.vacantRooms.toString()}
            icon={<Home />}
            variant="warning"
          />
          <KpiCard
            title="Faculty Members"
            value={adminData.totalFaculty.toString()}
            icon={<UserCheck />}
            variant="accent"
          />
        </div>

        {/* KPI Cards Row 2 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Active Courses"
            value={adminData.activeCourses.toString()}
            icon={<BookOpen />}
            variant="default"
          />
          <KpiCard
            title="Pending Admissions"
            value="89"
            icon={<Clock />}
            variant="warning"
          />
          <KpiCard
            title="Library Books Issued"
            value="1,234"
            icon={<BarChart3 />}
            variant="default"
          />
          <KpiCard
            title="Overall Attendance"
            value={`${adminData.overallAttendance}%`}
            icon={<TrendingUp />}
            variant="primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Real-time Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Real-time Activity Feed */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>Live campus operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {adminData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`
                    p-2 rounded-full
                    ${activity.type === 'success' ? 'bg-success/10 text-success' : ''}
                    ${activity.type === 'info' ? 'bg-primary/10 text-primary' : ''}
                    ${activity.type === 'warning' ? 'bg-warning/10 text-warning' : ''}
                  `}>
                    <MessageCircle className="h-4 w-4" />
                  </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Management Actions */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="premium" className="w-full justify-start" size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="accent" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Academic Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reports & Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Department Statistics */}
          <div className="space-y-6">
            {/* Department Enrollment */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Department Enrollment</CardTitle>
                <CardDescription>Current semester breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminData.departments.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">
                          {dept.students} / {dept.capacity} students
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Math.round((dept.students / dept.capacity) * 100)}%
                      </Badge>
                    </div>
                    <Progress value={(dept.students / dept.capacity) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financial Overview */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Current academic year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg bg-success/5">
                    <p className="text-sm text-muted-foreground">Fees Collected</p>
                    <p className="text-2xl font-bold text-success">₹2.4Cr</p>
                    <p className="text-xs text-muted-foreground">94.5% of target</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-warning/5">
                    <p className="text-sm text-muted-foreground">Pending Dues</p>
                    <p className="text-2xl font-bold text-warning">₹14.2L</p>
                    <p className="text-xs text-muted-foreground">127 students</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Collection Progress</span>
                    <span className="text-sm font-medium">94.5%</span>
                  </div>
                  <Progress value={94.5} className="h-3" />
                </div>

                <div className="pt-2">
                  <Button variant="accent" size="sm" className="w-full">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Status & Alerts */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card className="card-hover border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Server Maintenance",
                    message: "Scheduled maintenance on Sunday 2:00 AM",
                    priority: "medium",
                    time: "Tomorrow"
                  },
                  {
                    title: "Database Backup",
                    message: "Daily backup completed successfully",
                    priority: "low",
                    time: "30 mins ago"
                  },
                  {
                    title: "Fee Deadline Reminder",
                    message: "127 students have pending fee payments",
                    priority: "high",
                    time: "Now"
                  }
                ].map((alert, index) => (
                  <div key={index} className={`
                    p-3 rounded-lg border
                    ${alert.priority === 'high' ? 'border-destructive/20 bg-destructive/5' : ''}
                    ${alert.priority === 'medium' ? 'border-warning/20 bg-warning/5' : ''}
                    ${alert.priority === 'low' ? 'border-success/20 bg-success/5' : ''}
                  `}>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge 
                        variant={
                          alert.priority === 'high' ? 'destructive' : 
                          alert.priority === 'medium' ? 'secondary' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hostel Occupancy Status */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Hostel Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminData.hostelOccupancy.map((hostel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hostel.block}</p>
                        <p className="text-sm text-muted-foreground">{hostel.gender}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{hostel.occupied}/{hostel.total}</p>
                        <p className="text-xs text-muted-foreground">
                          {hostel.total - hostel.occupied} vacant
                        </p>
                      </div>
                    </div>
                    <Progress value={(hostel.occupied / hostel.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}