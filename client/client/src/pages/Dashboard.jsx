import { useEffect, useState } from "react";
import axios from "axios";

import {
  getToken,
  logout,
} from "../utils/auth";

import { getUser } from "../utils/user";

import { useNavigate } from "react-router-dom";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [file, setFile] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  const [progress, setProgress] =
    useState(0);

  const [dragging, setDragging] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const navigate =
    useNavigate();

  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/files",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setFiles(res.data.files);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        "Please select a file"
      );
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {
      const res =
        await axios.post(
          "http://localhost:5000/api/files/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },

            onUploadProgress: (
              progressEvent
            ) => {
              const percent =
                Math.round(
                  (progressEvent.loaded *
                    100) /
                    progressEvent.total
                );

              setProgress(
                percent
              );
            },
          }
        );

      toast.success(
        res.data.message
      );

      setProgress(0);

      setFile(null);

      fetchFiles();
    } catch (error) {
      setProgress(0);

      toast.error(
        error.response?.data
          ?.message ||
          "Upload failed"
      );
    }
  };

  const handleDelete =
    async (id) => {
      try {
        const res =
          await axios.delete(
            `http://localhost:5000/api/files/${id}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

        toast.success(
          res.data.message
        );

        fetchFiles();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  const handleDragOver = (
    e
  ) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const droppedFile =
      e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  let filteredFiles =
    files.filter((file) =>
      file.originalName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (filter === "image") {
    filteredFiles =
      filteredFiles.filter((f) =>
        f.fileType.startsWith(
          "image"
        )
      );
  }

  if (filter === "pdf") {
    filteredFiles =
      filteredFiles.filter(
        (f) =>
          f.fileType ===
          "application/pdf"
      );
  }

  return (
    <div className="container">
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>
            Welcome,
            {user?.name ||
              "User"}
          </h1>

          <p>
            {user?.email}
          </p>
        </div>

        <button
          onClick={
            handleLogout
          }
          style={{
            width: "140px",
            background:
              "#dc2626",
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}

      <div className="stats">
        <div className="card">
          <p>Total Files</p>

          <h2>
            {files.length}
          </h2>
        </div>

        <div className="card">
          <p>Images</p>

          <h2>
            {
              files.filter((f) =>
                f.fileType.startsWith(
                  "image"
                )
              ).length
            }
          </h2>
        </div>

        <div className="card">
          <p>PDFs</p>

          <h2>
            {
              files.filter(
                (f) =>
                  f.fileType ===
                  "application/pdf"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Upload Area */}

      <div
        onDragOver={
          handleDragOver
        }
        onDragLeave={
          handleDragLeave
        }
        onDrop={handleDrop}
        style={{
          border: dragging
            ? "2px dashed #22c55e"
            : "2px dashed #6b7280",

          padding: "40px",

          textAlign: "center",

          borderRadius: "10px",

          marginTop: "20px",

          background:
            dragging
              ? "#1f2937"
              : "transparent",

          transition: "0.3s",
        }}
      >
        <p>
          Drag & Drop File Here
        </p>

        <p>OR</p>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target
                .files[0]
            )
          }
        />

        {file && (
          <p>
            Selected:
            {" "}
            {file.name}
          </p>
        )}
      </div>

      <button
        onClick={
          handleUpload
        }
      >
        Upload File
      </button>

      {/* Progress */}

      <div
        style={{
          width: "100%",
          background:
            "#374151",
          borderRadius: "5px",
          marginTop: "15px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background:
              "#22c55e",
            color: "white",
            textAlign:
              "center",
            padding: "10px",
          }}
        >
          {progress > 0
            ? `${progress}%`
            : ""}
        </div>
      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* Filter */}

      <select
        value={filter}
        onChange={(e) =>
          setFilter(
            e.target.value
          )
        }
      >
        <option value="all">
          All Files
        </option>

        <option value="image">
          Images
        </option>

        <option value="pdf">
          PDFs
        </option>
      </select>

      {/* Files */}

      <div className="file-list">
        <h2>
          Your Files
        </h2>

        {filteredFiles.map(
          (item) => {
            const fileUrl = `http://localhost:5000/${item.filePath}`;

            return (
              <div
                className="file-item"
                key={
                  item._id
                }
              >
                <p>
                  <strong>
                    Name:
                  </strong>{" "}
                  {
                    item.originalName
                  }
                </p>

                <p>
                  <strong>
                    Type:
                  </strong>{" "}
                  {
                    item.fileType
                  }
                </p>

                <p>
                  <strong>
                    Size:
                  </strong>{" "}
                  {(
                    item.fileSize /
                    1024
                  ).toFixed(
                    2
                  )}{" "}
                  KB
                </p>

                {item.fileType.startsWith(
                  "image"
                ) && (
                  <img
                    src={
                      fileUrl
                    }
                    alt={
                      item.originalName
                    }
                    style={{
                      width:
                        "100%",
                      marginTop:
                        "10px",
                      borderRadius:
                        "10px",
                    }}
                  />
                )}

                {item.fileType ===
                  "application/pdf" && (
                  <a
                    href={
                      fileUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF
                  </a>
                )}

                <div>
                  <a
                    href={
                      fileUrl
                    }
                    download
                  >
                    <button>
                      Download
                    </button>
                  </a>
                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      item._id
                    )
                  }
                  style={{
                    background:
                      "#dc2626",
                    marginTop:
                      "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            );
          }
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;