import React, { useEffect, useState } from "react";
import axios from "axios";
import FolderView from "./FolderView";
import Execution from "./Execution";
import "./App.css";

const FileExplorer = ({ folderPath }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [executionOutput, setExecutionOutput] = useState("");

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/get-folder?path=${encodeURIComponent(folderPath)}`
        );
        setData(response.data);
      } catch {
        setError("Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderPath]);

  const handleFileClick = async (filePath, fileName) => {
    if (!filePath.endsWith(".py")) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/get-file-content?path=${encodeURIComponent(filePath)}`
      );
      setSelectedFile(fileName);
      setSelectedFilePath(filePath);
      setFileContent(response.data.content);
      setExecutionOutput(""); // Clear previous output
    } catch {
      setFileContent("Failed to load file");
    }
  };

  const handleExecute = async (filePath) => {
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        file_path: filePath,
      });
      setExecutionOutput(response.data.output || response.data.error);
    } catch {
      setExecutionOutput("Execution failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (<>
    <h2>Python File Manager & Executor</h2>
    <div className="file-explorer">
      {data ? (
          <div className="left-nav"><FolderView folder={data} onFileClick={handleFileClick} /></div>
        
      ) : (
        <p>No data available</p>
      )}
      <Execution 
        fileName={selectedFile} 
        content={fileContent} 
        output={executionOutput} 
        onExecute={handleExecute} 
        selectedFilePath={selectedFilePath} 
      />
    </div>
    </>
  );
};

export default FileExplorer;
