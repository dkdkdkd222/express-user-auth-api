const express = require('express');
const router = express.Router();
const {registerUser, retrieveUser, loginUser, updateUserProfile, getAllUsers, changePassword, deleteUser} = require('../controllers/user-controller.js');
const {verifyToken} = require('../middleware/auth-middleware');
router.post('/register', registerUser);
router.get('/me', verifyToken, retrieveUser);
router.get('/get-all-users', verifyToken, getAllUsers)
router.post('/user-login', loginUser)
router.put('/update-user', verifyToken, updateUserProfile);
router.patch('/change-password', verifyToken, changePassword)
router.delete('/delete-user', verifyToken, deleteUser)
module.exports = router;