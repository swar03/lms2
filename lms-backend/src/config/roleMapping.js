// Email to role mapping for Google OAuth
const EMAIL_ROLE_MAPPING = {
  // Admin emails
  'admin@lms.com': 'ADMIN',
  'admin@cyberlms.com': 'ADMIN',
  
  // Manager emails
  'manager@lms.com': 'MANAGER',
  'manager@cyberlms.com': 'MANAGER',
  
  // Add more admin/manager emails as needed
};

function getRoleFromEmail(email) {
  return EMAIL_ROLE_MAPPING[email.toLowerCase()] || 'STUDENT';
}

module.exports = { getRoleFromEmail };