-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'faculty', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL,
    student_id TEXT UNIQUE,
    employee_id TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    head_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 3,
    department_id UUID REFERENCES public.departments(id),
    semester INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    faculty_id UUID REFERENCES public.profiles(id) NOT NULL,
    semester TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    room_number TEXT,
    schedule_time TIME,
    schedule_days TEXT[], -- Array of days like ['monday', 'wednesday', 'friday']
    max_students INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enrollments table (students enrolled in classes)
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    class_id UUID REFERENCES public.classes(id) NOT NULL,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'active',
    UNIQUE(student_id, class_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    class_id UUID REFERENCES public.classes(id) NOT NULL,
    attendance_date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
    marked_by UUID REFERENCES public.profiles(id),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, class_id, attendance_date)
);

-- Create grades table
CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    class_id UUID REFERENCES public.classes(id) NOT NULL,
    exam_type TEXT NOT NULL, -- 'midterm', 'final', 'quiz', 'assignment'
    grade DECIMAL(5,2),
    max_grade DECIMAL(5,2) DEFAULT 100,
    graded_by UUID REFERENCES public.profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fees table
CREATE TABLE public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    semester TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    tuition_fee DECIMAL(10,2) NOT NULL,
    hostel_fee DECIMAL(10,2) DEFAULT 0,
    other_fees DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    exam_type TEXT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- duration in minutes
    room_number TEXT,
    max_marks DECIMAL(5,2) DEFAULT 100,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hostel_blocks table
CREATE TABLE public.hostel_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    total_rooms INTEGER NOT NULL,
    occupied_rooms INTEGER DEFAULT 0,
    block_type TEXT, -- 'boys', 'girls'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hostel_rooms table
CREATE TABLE public.hostel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID REFERENCES public.hostel_blocks(id) NOT NULL,
    room_number TEXT NOT NULL,
    capacity INTEGER DEFAULT 2,
    occupied_count INTEGER DEFAULT 0,
    room_type TEXT DEFAULT 'double',
    UNIQUE(block_id, room_number)
);

-- Create hostel_assignments table
CREATE TABLE public.hostel_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    room_id UUID REFERENCES public.hostel_rooms(id) NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    checkout_date DATE,
    status TEXT CHECK (status IN ('active', 'checked_out')) DEFAULT 'active',
    UNIQUE(student_id, room_id)
);

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    target_audience TEXT[], -- ['student', 'faculty', 'admin'] or specific groups
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table (for student-faculty communication)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    replied_to UUID REFERENCES public.messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create security definer function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = required_role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can view student profiles in their classes"
ON public.profiles FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') AND 
  role = 'student' AND 
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE e.student_id = profiles.id AND c.faculty_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

-- RLS Policies for departments
CREATE POLICY "Everyone can view departments"
ON public.departments FOR SELECT
USING (true);

CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subjects
CREATE POLICY "Everyone can view subjects"
ON public.subjects FOR SELECT
USING (true);

CREATE POLICY "Admins can manage subjects"
ON public.subjects FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Students can view their enrolled classes"
ON public.classes FOR SELECT
USING (
  public.has_role(auth.uid(), 'student') AND
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.class_id = classes.id AND e.student_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Faculty can view their classes"
ON public.classes FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') AND
  faculty_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all classes"
ON public.classes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments"
ON public.enrollments FOR SELECT
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Faculty can view enrollments for their classes"
ON public.enrollments FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') AND
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = enrollments.class_id AND c.faculty_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can manage enrollments"
ON public.enrollments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance
CREATE POLICY "Students can view their attendance"
ON public.attendance FOR SELECT
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Faculty can manage attendance for their classes"
ON public.attendance FOR ALL
USING (
  public.has_role(auth.uid(), 'faculty') AND
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = attendance.class_id AND c.faculty_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can view all attendance"
ON public.attendance FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for grades
CREATE POLICY "Students can view their grades"
ON public.grades FOR SELECT
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Faculty can manage grades for their classes"
ON public.grades FOR ALL
USING (
  public.has_role(auth.uid(), 'faculty') AND
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = grades.class_id AND c.faculty_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can view all grades"
ON public.grades FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for fees
CREATE POLICY "Students can view their fees"
ON public.fees FOR SELECT
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage fees"
ON public.fees FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for leave_requests
CREATE POLICY "Students can manage their leave requests"
ON public.leave_requests FOR ALL
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage all leave requests"
ON public.leave_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exams
CREATE POLICY "Students can view exams for their subjects"
ON public.exams FOR SELECT
USING (
  public.has_role(auth.uid(), 'student') AND
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE c.subject_id = exams.subject_id AND e.student_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Faculty can view exams for their subjects"
ON public.exams FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') AND
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.subject_id = exams.subject_id AND c.faculty_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can manage all exams"
ON public.exams FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for hostel tables
CREATE POLICY "Students can view hostel blocks"
ON public.hostel_blocks FOR SELECT
USING (public.has_role(auth.uid(), 'student'));

CREATE POLICY "Admins can manage hostel blocks"
ON public.hostel_blocks FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view hostel rooms"
ON public.hostel_rooms FOR SELECT
USING (public.has_role(auth.uid(), 'student'));

CREATE POLICY "Admins can manage hostel rooms"
ON public.hostel_rooms FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their hostel assignment"
ON public.hostel_assignments FOR SELECT
USING (
  student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage hostel assignments"
ON public.hostel_assignments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for announcements
CREATE POLICY "Users can view relevant announcements"
ON public.announcements FOR SELECT
USING (
  is_active = true AND
  (expires_at IS NULL OR expires_at > now()) AND
  (
    target_audience IS NULL OR
    public.get_user_role(auth.uid())::text = ANY(target_audience) OR
    'all' = ANY(target_audience)
  )
);

CREATE POLICY "Admins and faculty can create announcements"
ON public.announcements FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'faculty')
);

CREATE POLICY "Authors can update their announcements"
ON public.announcements FOR UPDATE
USING (
  author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  recipient_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Recipients can update message read status"
ON public.messages FOR UPDATE
USING (
  recipient_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- RLS Policies for activity_logs
CREATE POLICY "Users can view their activity logs"
ON public.activity_logs FOR SELECT
USING (
  user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (true);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    COALESCE((new.raw_user_meta_data ->> 'role')::user_role, 'student')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate CGPA
CREATE OR REPLACE FUNCTION public.calculate_student_cgpa(student_uuid UUID)
RETURNS DECIMAL(3,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ROUND(AVG(g.grade * s.credits) / AVG(s.credits), 2)
  FROM public.grades g
  JOIN public.classes c ON g.class_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  WHERE g.student_id = (SELECT id FROM public.profiles WHERE user_id = student_uuid)
  AND g.grade IS NOT NULL;
$$;

-- Create function to calculate attendance percentage
CREATE OR REPLACE FUNCTION public.calculate_attendance_percentage(student_uuid UUID, class_uuid UUID DEFAULT NULL)
RETURNS DECIMAL(5,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / COUNT(*)) * 100, 2)
    END
  FROM public.attendance a
  WHERE a.student_id = (SELECT id FROM public.profiles WHERE user_id = student_uuid)
  AND (class_uuid IS NULL OR a.class_id = class_uuid);
$$;