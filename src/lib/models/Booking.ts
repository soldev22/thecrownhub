import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // ISO date string: "YYYY-MM-DD"
  chairNumber: { type: Number, required: true }, // 1–4
}, {
  timestamps: true,
});

export const Booking = models.Booking || model('Booking', BookingSchema);
