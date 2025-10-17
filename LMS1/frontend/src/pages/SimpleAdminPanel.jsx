import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const SimpleAdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchData = async (type) => {
    setLoading(true)
    try {
      const response = await api.get(`/${type}`)
      setData(prev => ({ ...prev, [type]: response.data }))
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchData(activeTab)
    }
  }, [activeTab, user])

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p>Admin access required</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'submissions', label: 'Submissions', icon: '📝' }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 capitalize">{activeTab}</h2>
              
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.users || []).map((user) => (
                        <tr key={user.id} className="border-b border-gray-700">
                          <td className="py-3">{user.fullName}</td>
                          <td className="py-3 text-gray-400">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'ADMIN' ? 'bg-red-600 text-red-100' :
                              user.role === 'MANAGER' ? 'bg-blue-600 text-blue-100' :
                              'bg-green-600 text-green-100'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="grid gap-4">
                  {(data.courses || []).map((course) => (
                    <div key={course.id} className="bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-gray-400 mt-1">{course.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-blue-400">
                          📚 {course._count?.modules || 0} modules
                        </span>
                        <span className="text-gray-500">
                          Created: {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="text-center py-8 text-gray-400">
                  Submissions data will be displayed here
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimpleAdminPanel