/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, model, models } from "mongoose";

const MainJobSchema = new Schema({
  title: { type: String, required: true },
  client: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export const MainJob = models.MainJob || model("MainJob", MainJobSchema);
