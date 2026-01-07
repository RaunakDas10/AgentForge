import mongoose, { Schema, Document } from "mongoose";

export interface IExecution extends Document {
  agentId: string;
  userId: string;
  status: "running" | "completed" | "failed";
  startTime: Date;
  endTime?: Date;
  duration?: number;
  results: any[];
  logs: Array<{
    timestamp: Date;
    level: "info" | "warning" | "error";
    message: string;
    data?: any;
  }>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const executionSchema = new Schema<IExecution>(
  {
    agentId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running"
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number },
   results: { type: Schema.Types.Mixed, default: [] },  // NOT [Schema.Types.Mixed]
    logs: [{
      timestamp: { type: Date, default: Date.now },
      level: { type: String, enum: ["info", "warning", "error"], default: "info" },
      message: { type: String, required: true },
      data: { type: Schema.Types.Mixed }
    }],
    error: { type: String }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
executionSchema.index({ agentId: 1, createdAt: -1 });
executionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IExecution>("Execution", executionSchema);