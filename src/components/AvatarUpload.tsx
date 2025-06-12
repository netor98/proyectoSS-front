import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { uploadService } from '../services/uploadService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  size = 'lg',
  editable = false,
  className = ''
}) => {
  const { user, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5'
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return undefined;

    // If avatar is already a full URL, return it
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    }

    // If avatar is a filename, construct the URL
    if (user.avatar.includes('/')) {
      // It's a file path, extract filename
      const filename = user.avatar.split('/').pop();
      return uploadService.getAvatarUrl(filename!);
    }

    // It's just a filename
    return uploadService.getAvatarUrl(user.avatar);
  };

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = uploadService.validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!, {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadService.uploadAvatar(file);

      // Update user context with new avatar URL
      updateUser({
        avatar: response.filename
      });

      toast.success('Avatar actualizado correctamente', {
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);

      let errorMessage = 'Error al subir la imagen';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      toast.error(errorMessage, {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await uploadService.deleteAvatar();
      updateUser({ avatar: '' });

      toast.success('Avatar eliminado correctamente', {
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error al eliminar el avatar', {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} ${
          editable && !isUploading ? 'cursor-pointer' : ''
        } ${dragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        onDragOver={editable ? handleDragOver : undefined}
        onDragLeave={editable ? handleDragLeave : undefined}
        onDrop={editable ? handleDrop : undefined}
        onClick={editable && !isUploading ? openFileDialog : undefined}
      >
        <Avatar className={`${sizeClasses[size]} transition-opacity ${
          isUploading ? 'opacity-50' : ''
        }`}>
          <AvatarImage src={getAvatarUrl()} alt="Avatar" />
          <AvatarFallback className="text-lg font-semibold">
            {user?.first_names?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {/* Edit button */}
        {editable && !isUploading && (
          <Button
            size="icon"
            className={`absolute -bottom-1 -right-1 ${buttonSizeClasses[size]} rounded-full shadow-lg`}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            <Camera className={iconSizeClasses[size]} />
          </Button>
        )}

        {/* Delete button (only show if user has avatar) */}
        {editable && !isUploading && user?.avatar && (
          <Button
            size="icon"
            className={`absolute -top-1 -right-1 ${buttonSizeClasses[size]} rounded-full shadow-lg bg-red-500 hover:bg-red-600`}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAvatar();
            }}
          >
            <X className={iconSizeClasses[size]} />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag and drop hint */}
      {editable && dragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-full border-2 border-dashed border-blue-500">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
