import { useState } from "react"
import { BookOpen, ArrowRight, Users, Award, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link } from "react-router-dom"

const Index = () => {
  const [activeRole, setActiveRole] = useState<'student' | 'faculty' | 'admin'>('student')

  const roleFeatures = {
    student: [
      "View attendance and grades",
      "Pay fees securely",
      "Access hostel information",
      "Download transcripts",
      "Request leaves online"
    ],
    faculty: [
      "Manage class rosters",
      "Mark attendance digitally",
      "Upload grades and assignments",
      "Communicate with students",
      "Access performance analytics"
    ],
    admin: [
      "Monitor campus operations",
      "Manage user accounts",
      "Generate comprehensive reports",
      "Track financial metrics",
      "Oversee hostel management"
    ]
  }

  const dashboardRoutes = {
    student: '/student-dashboard',
    faculty: '/faculty-dashboard', 
    admin: '/admin-dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CampusOne ERP</h1>
              <p className="text-xs text-muted-foreground">Student Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to <span className="bg-gradient-hero bg-clip-text text-transparent">CampusOne</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive Student Management ERP designed for modern educational institutions. 
            Streamline operations for students, faculty, and administrators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="premium" size="xl" className="w-full sm:w-auto">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Role Selection & Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Choose Your Role
          </h2>
          
          {/* Role Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8 p-1 bg-muted rounded-lg max-w-md mx-auto">
            {[
              { key: 'student', label: 'Student', icon: Users },
              { key: 'faculty', label: 'Faculty', icon: Award },
              { key: 'admin', label: 'Admin', icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeRole === key ? "default" : "ghost"}
                className="flex-1 flex items-center gap-2"
                onClick={() => setActiveRole(key as typeof activeRole)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Role Features */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {activeRole === 'student' && <Users className="h-5 w-5 text-primary" />}
                  {activeRole === 'faculty' && <Award className="h-5 w-5 text-accent" />}
                  {activeRole === 'admin' && <Shield className="h-5 w-5 text-success" />}
                  {activeRole} Features
                </CardTitle>
                <CardDescription>
                  Designed specifically for {activeRole}s to enhance productivity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roleFeatures[activeRole].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                <Link to={dashboardRoutes[activeRole]} className="block pt-4">
                  <Button variant="outline" className="w-full">
                    View {activeRole} Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Demo */}
            <Card className="card-hover bg-gradient-subtle border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Live Demo Access
                </CardTitle>
                <CardDescription>
                  Try the system with demo credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-background/50">
                    <p className="text-sm font-medium">Demo Student</p>
                    <p className="text-xs text-muted-foreground">Email: student@demo.edu</p>
                    <p className="text-xs text-muted-foreground">Pass: demo123</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-background/50">
                    <p className="text-sm font-medium">Demo Faculty</p>
                    <p className="text-xs text-muted-foreground">Email: faculty@demo.edu</p>
                    <p className="text-xs text-muted-foreground">Pass: demo123</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-background/50">
                    <p className="text-sm font-medium">Demo Admin</p>
                    <p className="text-xs text-muted-foreground">Email: admin@demo.edu</p>
                    <p className="text-xs text-muted-foreground">Pass: demo123</p>
                  </div>
                </div>
                <Link to="/login">
                  <Button variant="accent" className="w-full">
                    Try Live Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Academic Management",
                description: "Comprehensive tracking of attendance, grades, and academic progress",
                icon: BookOpen,
                color: "primary"
              },
              {
                title: "Financial Operations",
                description: "Secure fee payments, financial reporting, and transaction management",
                icon: Shield,
                color: "success"
              },
              {
                title: "Hostel Management",
                description: "Room allocation, occupancy tracking, and facility management",
                icon: Users,
                color: "accent"
              }
            ].map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`
                      p-3 rounded-lg 
                      ${feature.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                      ${feature.color === 'success' ? 'bg-success/10 text-success' : ''}
                      ${feature.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
                    `}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <Card className="card-hover bg-gradient-hero text-white border-0 shadow-glow max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-white/90 mb-6">
                Join thousands of educational institutions already using CampusOne ERP to streamline their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign In to Your Account
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Contact Sales Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
