import React, { useState } from "react";
import ImportExcel from "../../Components/ImportExcelData/ImportExcel";

const TestPage = () => {
  const [sheetData, setSheetData] = useState(null);
  const onHandleSheetData = (e) => {
    console.log("File Uploaded", e);
    setSheetData(e);
  };
  return (
    <>
      <div>TestPage</div>
      <ImportExcel onHandleSheetData={onHandleSheetData} />
    </>
  );
};

export default TestPage;  
