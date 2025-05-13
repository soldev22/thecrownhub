import mongoose from "mongoose";

const popupBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  hour: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

popupBookingSchema.index({ date: 1, hour: 1 });

export const PopupBooking = mongoose.models.PopupBooking || mongoose.model("PopupBooking", popupBookingSchema);
