import React from "react";

const Execution = ({ fileName, content, output, onExecute, selectedFilePath }) => {
  if (!fileName) return null;

  return (<>
    <div className="execution-container">
        <div className="cont">
            <div className="run-div"><button className="run-btn" onClick={() => onExecute(selectedFilePath)}><img className="run-img" src="/imgg.png" alt="Run" /></button></div>
            <h3>File: {fileName}</h3>
                <pre className="file-content">{content}</pre>

                
        </div>
      </div>
            <div className="execution-output">
            <h3>Execution Output:</h3>
            <pre className="ter-out">{output}</pre>
            </div>
      
    </>
  );
};

export default Execution;
