import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'

const Dashboard = () => {
  const [stats, setStats] = useState({})
  const api = new ApiClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch basic stats
        const users = await api.resourceAction({ resourceId: 'User', actionName: 'list' })
        const courses = await api.resourceAction({ resourceId: 'Course', actionName: 'list' })
        const submissions = await api.resourceAction({ resourceId: 'Submission', actionName: 'list' })
        
        setStats({
          totalUsers: users.records.length,
          totalCourses: courses.records.length,
          totalSubmissions: submissions.records.length,
          adminUsers: users.records.filter(u => u.params.role === 'ADMIN').length,
          managerUsers: users.records.filter(u => u.params.role === 'MANAGER').length,
          studentUsers: users.records.filter(u => u.params.role === 'STUDENT').length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#374151' }}>LMS Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Total Users</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.totalUsers || 0}
          </div>
        </div>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Total Courses</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#10b981' }}>
            {stats.totalCourses || 0}
          </div>
        </div>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Submissions</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.totalSubmissions || 0}
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#f9fafb', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#374151' }}>User Distribution</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Admins: </span>
            {stats.adminUsers || 0}
          </div>
          <div>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Managers: </span>
            {stats.managerUsers || 0}
          </div>
          <div>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>Students: </span>
            {stats.studentUsers || 0}
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>Quick Actions</h4>
        <p style={{ margin: 0, color: '#92400e' }}>
          Use the navigation menu to manage Users, Courses, Modules, Lectures, Assignments, and more!
        </p>
      </div>
    </div>
  )
}

export default Dashboard