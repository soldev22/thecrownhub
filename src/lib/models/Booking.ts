// lib/models/Booking.ts

import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  userId: { type: String, required: true },          // ✅ required for filtering
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  chairNumber: { type: Number, required: true },
}, { timestamps: true });

export const Booking = models.Booking || model('Booking', BookingSchema);
