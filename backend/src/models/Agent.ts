import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  userId: string; // Changed to string for development
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  status: "draft" | "active" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<IAgent>(
  {
    userId: { type: String, required: true }, // Changed to String for development
    name: { type: String, required: true },
    description: { type: String, default: "" },
    nodes: { type: [Schema.Types.Mixed] as any, default: [] },
    edges: { type: [Schema.Types.Mixed] as any, default: [] },
    status: {
      type: String,
      enum: ["draft", "active", "paused"],
      default: "draft"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAgent>("Agent", agentSchema);