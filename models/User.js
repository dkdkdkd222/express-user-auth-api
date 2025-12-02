const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 username: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
 },
 password: {
  type: String,
  required: true,
  select: false
 },
 email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
 },
 emailVerified: {
  type: Boolean,
  default: false,
 },
 // Profile data
 firstName: {
  type: String,
  trim: true,
 },
 lastName: {
  type: String,
  trim: true,
 },
 // Password Reset Token
 passwordResetToken: String,
 passwordResetExpires: Date,

 // Roles
 role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
 }},{
  timestamps: true
})


module.exports = mongoose.model('User', UserSchema)