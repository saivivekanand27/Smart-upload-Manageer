function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <>
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
    </>
  );
}

export default SearchBar;