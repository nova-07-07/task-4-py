import "./App.css"; // Import the CSS file
import FileExplorer from "./FileManager";
import axios from "axios";
import { useState } from "react";

function App() {
  const [path, setPath] = useState(`I:\\project\\task_3 demo`);
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState(false);

  const handleFetch = async () => {
    try {
      setError(false);
      const dd =  await axios.get(`http://localhost:5000/get-folder?path=${encodeURIComponent(path)}`);
      if(dd.data.error){
        setError(true);
      }else{
        setDisplay(true);
      }

    } catch (err) {
      setError(true);
    }
  };

  return (
    <>
      {display ? (
        <FileExplorer folderPath={path} setDisplay={setDisplay} />
      ) : (
        <div className="input-container">
          <input placeholder="enter your python folder path like I:\project " className="in" value={path} onChange={(e) => setPath(e.target.value)} type="text" />
          <button onClick={handleFetch}>Go</button>
          {error && <span className="error-message">Invalid path</span>}
        </div>
      )}
    </>
  );
}

export default App;
