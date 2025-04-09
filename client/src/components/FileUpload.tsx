// src/components/FileUpload.tsx
import React, { useState } from 'react';

interface FileUploadProps {
  onUploadComplete?: (info: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const base64Data = reader.result; // e.g. "data:image/png;base64,iVBOR..."
          // Send to server
          const token = localStorage.getItem('token') || '';
          const res = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ fileData: base64Data }),
          });
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
          }
          const result = await res.json();
          setMessage(`File uploaded. Server response: ${JSON.stringify(result)}`);
          if (onUploadComplete) onUploadComplete(result);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setMessage(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h4>Upload Image</h4>
      <p style={{ color: 'red' }}>{message}</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
