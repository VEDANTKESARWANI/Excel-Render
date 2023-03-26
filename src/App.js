import React, { useEffect, useState } from "react";
import "./App.css";
import XLSX from "xlsx";
import { ProgressBar } from "react-bootstrap";

function MyTable(dataObject) {
  const tableRows = Object.values(dataObject).map((row) => (
    <tr>
      {Object.entries(row).map(([key, value]) =>
        key.includes("(Hover)") ? null : (
          <td
            title={row[key + " (Hover)"]}
            style={{ cursor: row[key + " (Hover)"] ? "pointer" : "default" }}
          >
            {value}
          </td>
        )
      )}
    </tr>
  ));

  const tableHeaders = Object.keys(dataObject[0])
    .filter((key) => !key.includes("(Hover)"))
    .map((header) => <th>{header}</th>);

  return (
    <table>
      <thead>
        <tr>{tableHeaders}</tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
      }
    };
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const object = XLSX.utils.sheet_to_json(sheet);
      setData(object);
      console.log(object);
      setUploadProgress(100);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (uploadProgress === 100) {
      setTimeout(() => {
        setUploadProgress(0);
      }, 1500);
    }
  }, [uploadProgress]);

  return (
    <div>
      <div className="excel-import-container">
        <div className="upload-container">
          <div className="file-upload">
            <label>
              <span> ABB </span>&nbsp;Project
            </label>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
            />
            <button>+</button>
          </div>
          {uploadProgress > 0 ? (
            <div className="progress-bar">
              <ProgressBar
                animated
                now={uploadProgress}
                label={`${uploadProgress}%`}
              />
            </div>
          ) : null}
        </div>

        {data.length > 0 ? (
          <div className="excel-table-wrapper">{MyTable(data)}</div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
