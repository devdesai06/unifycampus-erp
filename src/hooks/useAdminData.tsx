import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminData() {
  const [data, setData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    feesCollected: 0,
    vacantRooms: 0,
    activeCourses: 0,
    overallAttendance: 0,
    departments: [],
    hostelOccupancy: [],
    recentActivity: [],
    loading: true
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Get total students
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        // Get total faculty
        const { count: facultyCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'faculty');

        // Get total fees collected today
        const today = new Date().toISOString().split('T')[0];
        const { data: feesData } = await supabase
          .from('fees')
          .select('paid_amount')
          .gte('created_at', today);

        const feesCollected = feesData?.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0) || 0;

        // Get active courses count
        const { count: coursesCount } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        // Get hostel occupancy
        const { data: hostelBlocks } = await supabase
          .from('hostel_blocks')
          .select(`
            *,
            hostel_rooms(
              id,
              occupied_count,
              capacity
            )
          `);

        const hostelOccupancy = hostelBlocks?.map(block => {
          const totalRooms = block.total_rooms;
          const occupiedRooms = block.occupied_rooms || 0;
          return {
            block: block.name,
            occupied: occupiedRooms,
            total: totalRooms,
            gender: block.block_type === 'boys' ? 'Boys' : 'Girls'
          };
        }) || [];

        const vacantRooms = hostelOccupancy.reduce((sum, hostel) => 
          sum + (hostel.total - hostel.occupied), 0);

        // Get department enrollment
        const { data: departments } = await supabase
          .from('departments')
          .select(`
            *,
            subjects(
              classes(
                enrollments(count)
              )
            )
          `);

        const departmentStats = departments?.map(dept => {
          // This is a simplified calculation - you might need to adjust based on your data structure
          const studentCount = Math.floor(Math.random() * 800) + 200; // Placeholder
          const capacity = Math.floor(studentCount * 1.2);
          
          return {
            department: dept.name,
            students: studentCount,
            capacity: capacity,
            color: 'primary'
          };
        }) || [];

        // Get recent activity (simplified)
        const { data: recentMessages } = await supabase
          .from('messages')
          .select(`
            *,
            profiles!messages_sender_id_fkey(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        const recentActivity = recentMessages?.map(msg => ({
          action: `New message: ${msg.subject}`,
          user: `${msg.profiles.first_name} ${msg.profiles.last_name}`,
          time: new Date(msg.created_at).toLocaleString(),
          type: 'info',
          icon: 'message'
        })) || [];

        setData({
          totalStudents: studentCount || 0,
          totalFaculty: facultyCount || 0,
          feesCollected,
          vacantRooms,
          activeCourses: coursesCount || 0,
          overallAttendance: 87.5, // This would need a more complex calculation
          departments: departmentStats,
          hostelOccupancy,
          recentActivity,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAdminData();
  }, []);

  return data;
}