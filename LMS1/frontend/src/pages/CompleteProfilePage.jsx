import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import bgImage from '../assets/bg1.jpg'

const CompleteProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'))
  const [formData, setFormData] = useState({
    phone: '',
    university: '',
    major: '',
    experience: '',
    dateOfBirth: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load existing profile data
  React.useEffect(() => {
    if (user?.profile) {
      setFormData({
        phone: user.mobile || '',
        university: user.profile.occupation || '',
        major: user.profile.education || '',
        experience: user.profile.experience || '',
        dateOfBirth: user.profile.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.profile.address || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await api.put('/student/profile', {
        mobile: formData.phone,
        occupation: formData.university,
        education: formData.major,
        experience: formData.experience,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Profile completed successfully!')
      
      // Update user in localStorage
      const updatedUser = { ...user, mobile: formData.phone, profile: response.data.profile }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Redirect to dashboard
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Profile completion error:', error)
      toast.error(error.response?.data?.message || 'Failed to complete profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Welcome {user?.fullName}! Please provide additional information to complete your profile.
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-300 mb-1">
                University/Institution
              </label>
              <input
                id="university"
                name="university"
                type="text"
                value={formData.university}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your university or institution"
              />
            </div>
            
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-300 mb-1">
                Field of Study/Major
              </label>
              <input
                id="major"
                name="major"
                type="text"
                value={formData.major}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Computer Science, IT, etc."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
              Experience Level
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3-5 years)</option>
              <option value="expert">Expert (5+ years)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your address"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-2 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Completing...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfilePage