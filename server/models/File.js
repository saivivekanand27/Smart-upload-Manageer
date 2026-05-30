const mongoose = require("mongoose");

const fileSchema =
  new mongoose.Schema({
    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    fileHash: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type:
        mongoose.Schema.Types
          .ObjectId,

      ref: "User",
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports =
  mongoose.model(
    "File",
    fileSchema
  );