import { useEffect, useState } from "react";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import api from "../services/api";

import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import SearchBar from "../components/SearchBar";
import UploadBox from "../components/UploadBox";
import FileCard from "../components/FileCard";

function Dashboard() {
  const [files, setFiles] =
    useState([]);

  const [file, setFile] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  const [dragging, setDragging] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const fetchFiles = async () => {
    try {
      const res =
        await api.get(
          "/files"
        );

      setFiles(
        res.data.files
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload =
    async () => {
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
          await api.post(
            "/files/upload",
            formData,
            {
              onUploadProgress:
                (
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

        setFile(null);

        setProgress(0);

        fetchFiles();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Upload failed"
        );

        setProgress(0);
      }
    };

  const handleDelete =
    async (id) => {
      try {
        const res =
          await api.delete(
            `/files/${id}`
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
    <div className="dashboard-wrapper">
      <div className="container">
        <Header />

        <StatsCards
          files={files}
        />

        <UploadBox
          file={file}
          setFile={setFile}
          dragging={dragging}
          setDragging={
            setDragging
          }
        />

        <button
          onClick={
            handleUpload
          }
        >
          Upload File
        </button>

        <div
          className="progress-bar"
        >
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          >
            {progress > 0
              ? `${progress}%`
              : ""}
          </div>
        </div>

        <SearchBar
          search={search}
          setSearch={
            setSearch
          }
          filter={filter}
          setFilter={
            setFilter
          }
        />

        <div className="file-list">
          <h2>
            Your Files
          </h2>

          {filteredFiles
            .length === 0 ? (
            <p>
              No files found
            </p>
          ) : (
            filteredFiles.map(
              (item) => (
                <FileCard
                  key={
                    item._id
                  }
                  item={
                    item
                  }
                  handleDelete={
                    handleDelete
                  }
                />
              )
            )
          )}
        </div>

        <ToastContainer
          position="top-right"
        />
      </div>
    </div>
  );
}

export default Dashboard;