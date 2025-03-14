import React, { useState } from "react";

const FolderView = ({ folder, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="folder-container">
      <div className="folder" onClick={() => setIsOpen(!isOpen)}>
        📂 {folder.name}
      </div>
      {isOpen && folder.items && (
        <div className="folder-content">
          {folder.items.map((item, index) =>
            item.isfolder ? (
              <FolderView key={index} folder={item} onFileClick={onFileClick}  />
            ) : (
              <FileItem key={index} file={item} onFileClick={onFileClick} />
            )
          )}
        </div>
      )}
    </div>
  );
};

const FileItem = ({ file, onFileClick }) => (
  <div className="file" onClick={() => onFileClick(file.path, file.name)}>
    📄 {file.name}
  </div>
);

export default FolderView;



