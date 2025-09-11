import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useStudentData() {
  const { profile } = useAuth();
  const [data, setData] = useState({
    subjects: [],
    attendance: 0,
    cgpa: 0,
    upcomingExams: [],
    hostelInfo: null,
    feeStatus: null,
    announcements: [],
    loading: true
  });

  useEffect(() => {
    if (!profile?.id) return;

    const fetchStudentData = async () => {
      try {
        // Get enrolled subjects with attendance
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select(`
            *,
            classes!inner(
              *,
              subjects(*)
            )
          `)
          .eq('student_id', profile.id)
          .eq('status', 'active');

        // Calculate attendance for each subject
        const subjectsWithAttendance = await Promise.all(
          (enrollments || []).map(async (enrollment) => {
            const { data: attendanceData } = await supabase
              .from('attendance')
              .select('status')
              .eq('student_id', profile.id)
              .eq('class_id', enrollment.class_id);

            const totalClasses = attendanceData?.length || 0;
            const presentClasses = attendanceData?.filter(a => a.status === 'present').length || 0;
            const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

            return {
              name: enrollment.classes.subjects.name,
              code: enrollment.classes.subjects.code,
              attendance: attendancePercentage
            };
          })
        );

        // Get overall CGPA
        const { data: cgpaResult } = await supabase.rpc('calculate_student_cgpa', {
          student_uuid: profile.user_id
        });

        // Get overall attendance
        const { data: overallAttendance } = await supabase.rpc('calculate_attendance_percentage', {
          student_uuid: profile.user_id
        });

        // Get upcoming exams
        const { data: exams } = await supabase
          .from('exams')
          .select(`
            *,
            subjects(name)
          `)
          .gte('exam_date', new Date().toISOString().split('T')[0])
          .order('exam_date', { ascending: true })
          .limit(5);

        // Get hostel info
        const { data: hostelAssignment } = await supabase
          .from('hostel_assignments')
          .select(`
            *,
            hostel_rooms(
              room_number,
              hostel_blocks(name)
            )
          `)
          .eq('student_id', profile.id)
          .eq('status', 'active')
          .maybeSingle();

        // Get fee status
        const { data: feeData } = await supabase
          .from('fees')
          .select('*')
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get announcements
        const { data: announcements } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .or('target_audience.cs.{student,all}')
          .order('created_at', { ascending: false })
          .limit(5);

        setData({
          subjects: subjectsWithAttendance,
          attendance: overallAttendance || 0,
          cgpa: cgpaResult || 0,
          upcomingExams: exams?.map(exam => ({
            subject: exam.subjects.name,
            date: new Date(exam.exam_date).toLocaleDateString(),
            type: exam.exam_type
          })) || [],
          hostelInfo: hostelAssignment ? {
            block: hostelAssignment.hostel_rooms.hostel_blocks.name,
            room: hostelAssignment.hostel_rooms.room_number
          } : null,
          feeStatus: feeData ? {
            status: feeData.status,
            totalAmount: feeData.total_amount,
            paidAmount: feeData.paid_amount
          } : null,
          announcements: announcements?.map(ann => ({
            title: ann.title,
            message: ann.content,
            time: new Date(ann.created_at).toLocaleDateString()
          })) || [],
          loading: false
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStudentData();
  }, [profile?.id, profile?.user_id]);

  return data;
}