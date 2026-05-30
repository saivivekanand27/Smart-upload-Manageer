const express = require("express");

const router = express.Router();

const fs = require("fs");

const upload = require("../middleware/upload");

const File = require("../models/File");

const hashFile = require("../utils/hashFile");

const authMiddleware = require("../middleware/authMiddleware");

// Upload Route
router.post(
  "/upload",
  authMiddleware,
  (req, res) => {
    upload.single("file")(
      req,
      res,
      async (err) => {
        try {
          // Multer errors
          if (err) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  err.message,
              });
          }

          // No file uploaded
          if (!req.file) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  "No file uploaded",
              });
          }

          // Generate SHA256 hash
          const fileHash =
            await hashFile(
              req.file.path
            );

          // Check duplicate
          const existingFile =
            await File.findOne({
              fileHash,
            });

          if (existingFile) {
            // Delete duplicate uploaded file
            fs.unlinkSync(
              req.file.path
            );

            return res
              .status(400)
              .json({
                success: false,
                message:
                  "Duplicate file already exists",
              });
          }

          // Save metadata
          const newFile =
            await File.create({
              originalName:
                req.file
                  .originalname,

              fileName:
                req.file
                  .filename,

              filePath:
                req.file.path,

              fileType:
                req.file
                  .mimetype,

              fileSize:
                req.file.size,

              fileHash,

              user:
                req.user.id,
            });

          res.status(200).json({
            success: true,

            message:
              "File uploaded successfully",

            file: newFile,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              error.message,
          });
        }
      }
    );
  }
);

// GET logged-in user files
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const files =
        await File.find({
          user: req.user.id,
        }).sort({
          uploadedAt: -1,
        });

      res.status(200).json({
        success: true,

        count: files.length,

        files,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

// DELETE file
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const file =
        await File.findOne({
          _id: req.params.id,

          user: req.user.id,
        });

      if (!file) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "File not found",
          });
      }

      // Delete physical file
      if (
        fs.existsSync(
          file.filePath
        )
      ) {
        fs.unlinkSync(
          file.filePath
        );
      }

      // Delete MongoDB record
      await File.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,

        message:
          "File deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

module.exports = router;