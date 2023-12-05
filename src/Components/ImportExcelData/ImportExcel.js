import { useRef, useState } from "react";
import * as XLSX from "xlsx";

const ImportExcel = (props) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetData, setSheetData] = useState({});

  const fileExtensions = ["xlsx", "xls"];
  const fileRef = useRef();

  const checkFileExtension = (name) => {
    const extension = name.split(".").pop().toLowerCase();
    if (fileExtensions.includes(extension)) {
      return true; // Extension is supported
    } else {
      alert("Invalid File Extension");
      return false; // Extension is not supported
    }
  };
  const handleReadDataFromXl = (data) => {
    const wb = XLSX.read(data, { type: "array" });
    const sheetData = {}; // Store sheet data here

    // Update the sheet names state
    setSheetNames(wb.SheetNames);

    wb.SheetNames.forEach((sheetName) => {
      const ws = wb.Sheets[sheetName];
      const sheetDataArray = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Convert sheet to array of arrays
      sheetData[sheetName] = sheetDataArray;
    });
    console.log(sheetData);
    // Set the sheet data in state
    setSheetData(sheetData);
    return sheetData;
  };

  const handleFile = async (e) => {
    const myfile = e.target.files[0];
    if (!myfile) return;

    if (!checkFileExtension(myfile.name)) {
      alert("Invalid File Extension");
      return;
    }

    try {
      const data = await myfile.arrayBuffer();

      const mySheetData = handleReadDataFromXl(data);
      props.onHandleSheetData(mySheetData);
      setFile(myfile);
      setFileName(myfile.name);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Error reading Excel file. Please try again.");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName(null);
    props.onHandleSheetData(null);

    fileRef.current.value = "";
  };

  return (
    <div className="w-[500px] m-auto mt-10 bg-yellow-100 border border-spacing-x-1.5 shadow-lg rounded h-full p-5">
      <div className="flex flex-col">
        <div className="underline text-lg font-medium text-center">
          Excel File
        </div>
        {file && <label>FileName: {fileName}</label>}
        {!file && <label>Please Upload a file First</label>}
      </div>
      <div className="flex items-center justify-between">
        <div className="py-3">
          <input
            type="file"
            accept="xlsx,xls"
            multiple={false}
            onChange={(e) => handleFile(e)}
            ref={fileRef}
          />
        </div>
        <div
          className="rounded p-1 flex justify-center bg-red-500 cursor-pointer"
          onClick={handleRemoveFile}
        >
          Remove
        </div>
      </div>
      {sheetNames.length > 0 && (
        <div className="mt-4">
          <strong>Sheet Names:</strong>
          <ul>
            {sheetNames.map((sheetName, index) => (
              <li key={index}>
                <strong>{sheetName}</strong>
                <table>
                  <thead>
                    <tr>
                      {sheetData[sheetName][0].map((header, headerIndex) => (
                        <th key={headerIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData[sheetName].slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {sheetNames.length > 0 && (
        <div className="mt-4">
          <strong>Sheet Names:</strong>
          <ul>
            {sheetNames.map((sheetName, index) => (
              <li key={index}>{sheetName}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default ImportExcel;
