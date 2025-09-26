import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, ExternalLink, Upload } from 'lucide-react';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject, getMetadata } from 'firebase/storage';
import { app } from '../../../config/firebase';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storage = getStorage(app);
      const imagesRef = ref(storage, 'images');
      const list = await listAll(imagesRef);
      const items = await Promise.all(
        list.items.map(async (itemRef) => {
          const [url, meta] = await Promise.all([getDownloadURL(itemRef), getMetadata(itemRef)]);
          return {
            name: itemRef.name,
            url,
            size: meta.size || 0,
            created_at: meta.timeCreated || '',
          } as MediaFile;
        })
      );
      // sort by created_at desc if available
      items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      setFiles(items);
      setMessage(null);
    } catch (error) {
      setMessage('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(storageRef, file);
      setMessage('File uploaded successfully');
      await loadFiles();
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, `images/${fileName}`);
      await deleteObject(fileRef);
      setMessage('File deleted successfully');
      await loadFiles();
    } catch (error) {
      setMessage('Failed to delete file');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-gray-600 mt-2">Upload and manage your portfolio images and assets</p>
        </div>
        <label htmlFor="media-upload" className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 cursor-pointer">
          <input
            id="media-upload"
            name="media-upload"
            type="file"
            accept="image/*"
            onChange={uploadFile}
            disabled={uploading}
            className="hidden"
          />
          <Upload className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {message && (
          <div className="mb-4 text-sm text-gray-700">{message}</div>
        )}
        {files.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
            <p className="text-gray-600">Upload your first image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <div key={file.name} className="group relative bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => copyUrl(file.url)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => deleteFile(file.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};