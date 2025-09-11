import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  MessageCircle, 
  FileText,
  Clock,
  TrendingUp,
  User,
  Award,
  BarChart3,
  Upload
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { KpiCard } from "@/components/ui/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/useAuth"
import { useFacultyData } from "@/hooks/useFacultyData"

export default function FacultyDashboard() {
  const { profile } = useAuth();
  const facultyData = useFacultyData();
  if (facultyData.loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="faculty" userName={`${profile?.first_name} ${profile?.last_name}`} userEmail={profile?.email} />
      
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes, students, and academic activities.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Classes Teaching"
            value={facultyData.classes.length.toString()}
            icon={<BookOpen />}
            variant="primary"
          />
          <KpiCard
            title="Total Students"
            value={facultyData.totalStudents.toString()}
            icon={<Users />}
            variant="accent"
          />
          <KpiCard
            title="Pending Grades"
            value={facultyData.pendingGrades.toString()}
            icon={<FileText />}
            variant="warning"
          />
          <KpiCard
            title="Today's Classes"
            value={facultyData.todaySchedule.length.toString()}
            icon={<Clock />}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Today's Schedule & Quick Actions */}
          <div className="space-y-6">
            {/* Today's Class Schedule */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>March 15, 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {facultyData.todaySchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.subject}</p>
                      <p className="text-sm text-muted-foreground">{schedule.code} • {schedule.room}</p>
                      <p className="text-sm text-muted-foreground">{schedule.time}</p>
                    </div>
                    <Badge variant={schedule.status === 'completed' ? 'secondary' : 'default'}>
                      {schedule.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                      {schedule.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common faculty tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full justify-start" size="lg">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Attendance
                </Button>
                <Button variant="accent" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Grades
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Class Rosters & Performance */}
          <div className="space-y-6">
            {/* Class Roster Overview */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Class Rosters</CardTitle>
                <CardDescription>Current semester enrollment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {facultyData.classes.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{course.subject}</h4>
                        <p className="text-sm text-muted-foreground">{course.code}</p>
                      </div>
                      <Badge variant="secondary">{course.students} students</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Attendance</p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.attendance} className="flex-1 h-2" />
                          <span className="font-medium">{course.attendance}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Grade</p>
                        <p className="font-semibold text-lg">{course.avgGrade}/10</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Uploaded grades for CS602 midterm exam",
                    time: "2 hours ago",
                    type: "upload"
                  },
                  {
                    action: "Marked attendance for CS301 morning class",
                    time: "4 hours ago", 
                    type: "attendance"
                  },
                  {
                    action: "Sent assignment reminder to CS603 students",
                    time: "1 day ago",
                    type: "message"
                  },
                  {
                    action: "Created new quiz for Database Systems",
                    time: "2 days ago",
                    type: "create"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-full bg-primary/10">
                      {activity.type === 'upload' && <Upload className="h-3 w-3 text-primary" />}
                      {activity.type === 'attendance' && <CheckCircle className="h-3 w-3 text-primary" />}
                      {activity.type === 'message' && <MessageCircle className="h-3 w-3 text-primary" />}
                      {activity.type === 'create' && <FileText className="h-3 w-3 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Messages & Announcements */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    task: "Grade CS602 Assignment #3",
                    dueDate: "March 18, 2024",
                    priority: "high",
                    submissions: 35,
                    total: 42
                  },
                  {
                    task: "Upload CS301 Quiz Results",
                    dueDate: "March 20, 2024", 
                    priority: "medium",
                    submissions: 58,
                    total: 65
                  },
                  {
                    task: "Prepare CS603 Midterm Exam",
                    dueDate: "March 25, 2024",
                    priority: "medium",
                    submissions: 0,
                    total: 38
                  }
                ].map((task, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.task}</h4>
                        <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                      </div>
                      <Badge 
                        variant={
                          task.priority === 'high' ? 'destructive' : 
                          task.priority === 'medium' ? 'secondary' : 'secondary'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.submissions > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Submissions</span>
                          <span>{task.submissions}/{task.total}</span>
                        </div>
                        <Progress value={(task.submissions / task.total) * 100} className="h-1" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Messages */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Student Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {facultyData.messages.map((message, index) => (
                  <div key={index} className={`
                    p-3 border rounded-lg cursor-pointer hover:bg-muted/50
                    ${message.unread ? 'border-primary/20 bg-primary/5' : ''}
                  `}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">{message.student}</h4>
                        {message.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.subject}</p>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                  <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold">Excellent Teaching!</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your students' average performance is 15% above department average
                  </p>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Top 10% Faculty
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-primary">4.8</p>
                    <p className="text-xs text-muted-foreground">Student Rating</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-accent">89%</p>
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}