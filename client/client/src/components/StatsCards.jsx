function StatsCards({ files }) {
  const totalFiles =
    files.length;

  const totalImages =
    files.filter((file) =>
      file.fileType.startsWith(
        "image"
      )
    ).length;

  const totalPDFs =
    files.filter(
      (file) =>
        file.fileType ===
        "application/pdf"
    ).length;

  return (
    <div className="stats">
      <div className="card">
        <h3>Total Files</h3>

        <h2>{totalFiles}</h2>
      </div>

      <div className="card">
        <h3>Images</h3>

        <h2>{totalImages}</h2>
      </div>

      <div className="card">
        <h3>PDFs</h3>

        <h2>{totalPDFs}</h2>
      </div>
    </div>
  );
}

export default StatsCards;