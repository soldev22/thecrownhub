import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },           // add this
  userEmail: { type: String },          // add this
  date: { type: String, required: true },
  chairNumber: { type: Number, required: true },
}, { timestamps: true });

BookingSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
