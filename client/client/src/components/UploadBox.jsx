function UploadBox({
  file,
  setFile,
  dragging,
  setDragging,
}) {
  const handleDrop = (
    e
  ) => {
    e.preventDefault();

    setDragging(false);

    const droppedFile =
      e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() =>
        setDragging(false)
      }
      onDrop={handleDrop}
      className="upload-box"
    >
      <p>
        Drag & Drop File Here
      </p>

      <p>OR</p>

      <input
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files[0]
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
  );
}

export default UploadBox;