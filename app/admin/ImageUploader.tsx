'use client';

import { useRef, useState } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function ImageUploader({ value, onChange, label, hint }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        onChange(data.url);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="img-uploader-wrap">
      {label && <div className="img-uploader-label">{label}</div>}
      {hint && <div className="img-uploader-hint">{hint}</div>}
      <div
        className={`img-drop-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {uploading ? (
          <div className="img-uploading-state">
            <div className="spinner" />
            <span>Uploading...</span>
          </div>
        ) : value ? (
          <div className="img-preview-state">
            <img src={value} alt="Preview" className="img-preview-thumb" />
            <div className="img-preview-overlay">
              <span>🔄 Change Image</span>
            </div>
          </div>
        ) : (
          <div className="img-empty-state">
            <div className="img-upload-icon">📸</div>
            <div className="img-upload-text">Drag & drop an image here</div>
            <div className="img-upload-sub">or click to browse • JPG, PNG, WebP • max 5 MB</div>
          </div>
        )}
      </div>
      {error && <div className="img-error">{error}</div>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
      <style jsx>{`
        .img-uploader-wrap { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .img-uploader-label { font-size: 0.875rem; font-weight: 600; color: #1a1a2e; }
        .img-uploader-hint { font-size: 0.78rem; color: #6b7280; margin-top: -4px; }
        .img-drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          background: #f9fafb;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-drop-zone:hover, .img-drop-zone.drag-over {
          border-color: #6366f1;
          background: #eef2ff;
        }
        .img-drop-zone.uploading { cursor: wait; }
        .img-uploading-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px; color: #6366f1; font-size: 0.9rem; }
        .spinner {
          width: 28px; height: 28px;
          border: 3px solid #e0e7ff;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .img-empty-state { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 28px 16px; text-align: center; }
        .img-upload-icon { font-size: 2rem; }
        .img-upload-text { font-size: 0.9rem; font-weight: 600; color: #374151; }
        .img-upload-sub { font-size: 0.75rem; color: #9ca3af; }
        .img-preview-state { position: relative; width: 100%; }
        .img-preview-thumb { width: 100%; max-height: 180px; object-fit: cover; display: block; }
        .img-preview-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
          color: #fff; font-weight: 600; font-size: 0.9rem;
        }
        .img-preview-state:hover .img-preview-overlay { opacity: 1; }
        .img-error { font-size: 0.78rem; color: #ef4444; margin-top: 2px; }
      `}</style>
    </div>
  );
}
