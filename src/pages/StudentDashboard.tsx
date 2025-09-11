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
import { useAuth } from "@/hooks/useAuth"
import { useStudentData } from "@/hooks/useStudentData"

export default function StudentDashboard() {
  const { profile } = useAuth();
  const studentData = useStudentData();
  if (studentData.loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" userName={`${profile?.first_name} ${profile?.last_name}`} userEmail={profile?.email} />
      
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {profile?.first_name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Overall Attendance"
            value={`${studentData.attendance}%`}
            icon={<TrendingUp />}
            variant="primary"
            trend={{ value: 5, isPositive: true, label: "vs last month" }}
          />
          <KpiCard
            title="Fee Status"
            value={studentData.feeStatus?.status === 'paid' ? 'Paid' : 'Pending'}
            icon={<CheckCircle />}
            variant={studentData.feeStatus?.status === 'paid' ? 'success' : 'warning'}
          />
          <KpiCard
            title="Current CGPA"
            value={studentData.cgpa.toString()}
            icon={<BookOpen />}
            variant="accent"
          />
          <KpiCard
            title="Upcoming Exams"
            value={studentData.upcomingExams.length.toString()}
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
                  <p className="font-medium">{profile?.student_id || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{profile?.role}</p>
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
                {studentData.subjects.map((subject) => (
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
                {studentData.hostelInfo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Block</p>
                      <p className="font-medium">{studentData.hostelInfo.block}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium">{studentData.hostelInfo.room}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hostel assignment found</p>
                )}
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
                {studentData.upcomingExams.map((exam, index) => (
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
                {studentData.announcements.map((announcement, index) => (
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