import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../../config/firebase';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  type: 'profile' | 'hero' | 'project' | 'og';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  currentImage,
  type,
}) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);
      onUpload(publicUrl);
      setMessage('Image uploaded successfully');
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onUpload('');
    setMessage('Image removed');
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt={`${type} image`}
            className={`w-full object-cover rounded-lg border border-gray-200 ${
              type === 'profile' ? 'h-48' : type === 'hero' ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <button
              onClick={removeImage}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {type === 'profile' && 'Upload a profile photo'}
            {type === 'hero' && 'Upload a hero background image'}
            {type === 'project' && 'Upload a project screenshot'}
            {type === 'og' && 'Upload an Open Graph image (1200x630px recommended)'}
          </p>
        </div>
      )}

      <div>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={uploadFile}
            disabled={uploading}
            className="hidden"
          />
          <span className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : currentImage ? 'Replace Image' : 'Upload Image'}
          </span>
        </label>
      </div>
      {message && (
        <div className="text-sm text-gray-600">{message}</div>
      )}
    </div>
  );
};