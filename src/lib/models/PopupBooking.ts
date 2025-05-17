import mongoose from 'mongoose';

const PopupBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  hours: [{ type: Number, min: 8, max: 18 }],
}, { timestamps: true });

// Ensure a user can book once per date
PopupBookingSchema.index({ userId: 1, date: 1 }, { unique: true });

export const PopupBooking =
  mongoose.models.PopupBooking || mongoose.model('PopupBooking', PopupBookingSchema);
