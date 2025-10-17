import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-white">{user?.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Mobile</label>
                <p className="text-white">{user?.mobile || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p className={`font-medium ${
                  user?.status === 'APPROVED' ? 'text-green-400' :
                  user?.status === 'PENDING' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {user?.status || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Extended Profile */}
          {user?.profile && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.profile.occupation && (
                  <div>
                    <label className="text-sm text-gray-400">Occupation</label>
                    <p className="text-white">{user.profile.occupation}</p>
                  </div>
                )}
                {user.profile.country && (
                  <div>
                    <label className="text-sm text-gray-400">Country</label>
                    <p className="text-white">{user.profile.country}</p>
                  </div>
                )}
                {user.profile.whatsapp && (
                  <div>
                    <label className="text-sm text-gray-400">WhatsApp</label>
                    <p className="text-white">{user.profile.whatsapp}</p>
                  </div>
                )}
                {user.profile.dateOfBirth && (
                  <div>
                    <label className="text-sm text-gray-400">Date of Birth</label>
                    <p className="text-white">{new Date(user.profile.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
                {user.profile.gender && (
                  <div>
                    <label className="text-sm text-gray-400">Gender</label>
                    <p className="text-white">{user.profile.gender}</p>
                  </div>
                )}
                {user.profile.education && (
                  <div>
                    <label className="text-sm text-gray-400">Education</label>
                    <p className="text-white">{user.profile.education}</p>
                  </div>
                )}
              </div>

              {user.profile.address && (
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Address</label>
                  <p className="text-white">{user.profile.address}</p>
                </div>
              )}

              {user.profile.experience && (
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Work Experience</label>
                  <p className="text-white">{user.profile.experience}</p>
                </div>
              )}

              {user.profile.skills && (
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Skills</label>
                  <p className="text-white">{user.profile.skills}</p>
                </div>
              )}
            </div>
          )}

          {/* Account Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <p className="text-white">{user?.role || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email Verified</label>
                <p className="text-white">{user?.emailVerified ? '✅ Yes' : '❌ No'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              {user?.profile?.profileComplete && (
                <div>
                  <label className="text-sm text-gray-400">Profile Status</label>
                  <p className="text-green-400">✓ Complete</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
