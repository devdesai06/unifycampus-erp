import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useFacultyData() {
  const { profile } = useAuth();
  const [data, setData] = useState({
    classes: [],
    totalStudents: 0,
    todaySchedule: [],
    pendingGrades: 0,
    messages: [],
    loading: true
  });

  useEffect(() => {
    if (!profile?.id) return;

    const fetchFacultyData = async () => {
      try {
        // Get faculty's classes
        const { data: classes } = await supabase
          .from('classes')
          .select(`
            *,
            subjects(*),
            enrollments(count)
          `)
          .eq('faculty_id', profile.id);

        // Get class details with enrollment and performance
        const classesWithDetails = await Promise.all(
          (classes || []).map(async (classItem) => {
            // Get enrollment count
            const { count: enrollmentCount } = await supabase
              .from('enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('class_id', classItem.id)
              .eq('status', 'active');

            // Get average attendance for this class
            const { data: attendanceData } = await supabase
              .from('attendance')
              .select('status')
              .eq('class_id', classItem.id);

            const totalAttendance = attendanceData?.length || 0;
            const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0;
            const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

            // Get average grade for this class
            const { data: grades } = await supabase
              .from('grades')
              .select('grade')
              .eq('class_id', classItem.id)
              .not('grade', 'is', null);

            const avgGrade = grades?.length > 0 
              ? Math.round((grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) * 10) / 10 
              : 0;

            return {
              id: classItem.id,
              subject: classItem.subjects.name,
              code: classItem.subjects.code,
              students: enrollmentCount || 0,
              attendance: avgAttendance,
              avgGrade: avgGrade,
              room: classItem.room_number,
              time: classItem.schedule_time,
              days: classItem.schedule_days
            };
          })
        );

        // Calculate total students
        const totalStudents = classesWithDetails.reduce((sum, cls) => sum + cls.students, 0);

        // Get today's schedule (simplified - showing all classes for now)
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todayClasses = classesWithDetails.filter(cls => 
          cls.days?.includes(today)
        );

        // Get pending grades count
        const { count: pendingGradesCount } = await supabase
          .from('grades')
          .select('*', { count: 'exact', head: true })
          .in('class_id', classes?.map(c => c.id) || [])
          .is('grade', null);

        // Get recent messages
        const { data: messages } = await supabase
          .from('messages')
          .select(`
            *,
            profiles!messages_sender_id_fkey(first_name, last_name)
          `)
          .eq('recipient_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setData({
          classes: classesWithDetails,
          totalStudents,
          todaySchedule: todayClasses.map(cls => ({
            subject: cls.subject,
            code: cls.code,
            time: cls.time ? `${cls.time} - ${cls.time}` : 'TBD',
            room: cls.room || 'TBD',
            status: 'upcoming'
          })),
          pendingGrades: pendingGradesCount || 0,
          messages: messages?.map(msg => ({
            student: `${msg.profiles.first_name} ${msg.profiles.last_name}`,
            subject: msg.subject,
            time: new Date(msg.created_at).toLocaleDateString(),
            unread: !msg.is_read
          })) || [],
          loading: false
        });
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchFacultyData();
  }, [profile?.id]);

  return data;
}