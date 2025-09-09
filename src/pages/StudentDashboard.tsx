import { 
  User, 
  CreditCard, 
  BookOpen, 
  Calendar, 
  Home, 
  FileText, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { KpiCard } from "@/components/ui/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" userName="Sarah Johnson" userEmail="sarah.johnson@college.edu" />
      
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Overall Attendance"
            value="92%"
            icon={<TrendingUp />}
            variant="primary"
            trend={{ value: 5, isPositive: true, label: "vs last month" }}
          />
          <KpiCard
            title="Fee Status"
            value="Paid"
            icon={<CheckCircle />}
            variant="success"
          />
          <KpiCard
            title="Current CGPA"
            value="8.7"
            icon={<BookOpen />}
            variant="accent"
          />
          <KpiCard
            title="Upcoming Exams"
            value="3"
            icon={<Calendar />}
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">CS21B1089</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">B.Tech Computer Science</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">3rd Year</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Semester</p>
                  <p className="font-medium">6th Semester</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Fees
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Leave
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Transcripts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Class Schedule
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Academic Info */}
          <div className="space-y-6">
            {/* Current Subjects */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Current Subjects</CardTitle>
                <CardDescription>6th Semester - 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Machine Learning", code: "CS602", attendance: 85 },
                  { name: "Software Engineering", code: "CS603", attendance: 92 },
                  { name: "Database Systems", code: "CS604", attendance: 78 },
                  { name: "Web Development", code: "CS605", attendance: 95 },
                ].map((subject) => (
                  <div key={subject.code} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      </div>
                      <Badge variant={subject.attendance >= 85 ? "secondary" : "destructive"}>
                        {subject.attendance}%
                      </Badge>
                    </div>
                    <Progress value={subject.attendance} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hostel Information */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Hostel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="font-medium">A-Block</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium">A-204</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Warden</p>
                    <p className="font-medium">Dr. Smith</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upcoming Events & Announcements */}
          <div className="space-y-6">
            {/* Upcoming Exams */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: "Machine Learning", date: "March 15, 2024", type: "Mid-term" },
                  { subject: "Software Engineering", date: "March 20, 2024", type: "Assignment" },
                  { subject: "Database Systems", date: "March 25, 2024", type: "Final" },
                ].map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{exam.subject}</p>
                      <p className="text-sm text-muted-foreground">{exam.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{exam.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Fee Payment Deadline",
                    message: "Semester fees due by March 30th",
                    type: "warning",
                    time: "2 hours ago"
                  },
                  {
                    title: "Library Hours Extended",
                    message: "Library now open 24/7 during exam period",
                    type: "info",
                    time: "1 day ago"
                  },
                  {
                    title: "Hostel Maintenance",
                    message: "Water supply will be off on Sunday morning",
                    type: "warning",
                    time: "2 days ago"
                  },
                ].map((announcement, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">{announcement.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
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