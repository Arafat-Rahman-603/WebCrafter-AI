import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const websiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Website",
    },
    thumbnail: {
      type: String,
    },
    letestCode: {
      type: String,
      required: true,
    },
    conversation: [messageSchema],
    deploy: {
      type: Boolean,
      default: false,
    },
    deployUrl: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Website = mongoose.model("Website", websiteSchema);
