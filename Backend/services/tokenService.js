const crypto = require('crypto');
const db = require('../config/db'); 

// Token generate karne ka function
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Token create karne ka function (callback based)
function createTokens(employeeId, callback) {
  const passwordToken = generateToken();
  const faceToken = generateToken();

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours

  // Pehle password reset token insert karo
  db.query(
    'INSERT INTO password_reset_tokens (employee_id, token, expires_at) VALUES (?, ?, ?)',
    [employeeId, passwordToken, expiresAt],
    (err, result) => {
      if (err) {
        console.error('Password token creation error:', err);
        return callback(err);
      }

      // Phir face registration token insert karo
      db.query(
        'INSERT INTO face_registration_tokens (employee_id, token, expires_at) VALUES (?, ?, ?)',
        [employeeId, faceToken, expiresAt],
        (err2, result2) => {
          if (err2) {
            console.error('Face token creation error:', err2);
            return callback(err2);
          }

          // Agar dono insert sahi ho gaye, to dono tokens return karo
          return callback(null, {
            passwordToken,
            faceToken,
          });
        }
      );
    }
  );
}

module.exports = {
  generateToken,
  createTokens,
};
