import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  company: { type: String, default: '' }, // Optional
});

export const User = models.User || model('User', UserSchema);
