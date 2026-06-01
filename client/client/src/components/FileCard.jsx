function FileCard({
  item,
  handleDelete,
}) {
  const fileUrl = `http://localhost:5000/${item.filePath}`;

  return (
    <div className="file-item">
      <p>
        <strong>Name:</strong>{" "}
        {item.originalName}
      </p>

      <p>
        <strong>Type:</strong>{" "}
        {item.fileType}
      </p>

      <p>
        <strong>Size:</strong>{" "}
        {(
          item.fileSize /
          1024
        ).toFixed(2)}{" "}
        KB
      </p>

      {item.fileType.startsWith(
        "image"
      ) && (
        <img
          src={fileUrl}
          alt={
            item.originalName
          }
        />
      )}

      {item.fileType ===
        "application/pdf" && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open PDF
        </a>
      )}

      <a
        href={fileUrl}
        download
      >
        <button>
          Download
        </button>
      </a>

      <button
        className="delete-btn"
        onClick={() =>
          handleDelete(
            item._id
          )
        }
      >
        Delete
      </button>
    </div>
  );
}

export default FileCard;