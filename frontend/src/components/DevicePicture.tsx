// src/components/DevicePicture.tsx
import React, { useMemo, useState, useRef } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Button, Stack } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAllEndpoints } from '../store/serverSlice';

interface DevicePictureProps {
  pictureData?: any;
}

const DevicePicture: React.FC<DevicePictureProps> = ({ pictureData }) => {
  const dispatch = useAppDispatch();
  const { serverUrl } = useAppSelector((state) => state.server);
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pictureUrl = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (!pictureData) return null;
    if (pictureData.objectUrl) return pictureData.objectUrl;
    if (typeof pictureData === 'string') return pictureData;
    return null;
  }, [pictureData, previewUrl]);

  const handleEditClick = () => {
    // Không set isEditing ở đây, chỉ mở file dialog
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Chỉ set isEditing khi file được chọn thành công
      setIsEditing(true);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    // Nếu user Cancel dialog (không chọn file), không làm gì cả
    // isEditing vẫn là false, Edit button vẫn hiển thị
  };

  const handleConfirm = async () => {
    if (!selectedFile || !serverUrl) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('picture', selectedFile);

      const response = await fetch(`${serverUrl}/picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update picture');
      }

      await dispatch(fetchAllEndpoints()).unwrap();

      setIsEditing(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error updating picture:', error);
      alert('Failed to update picture');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card sx={{ position: 'relative', width: 'fit-content', maxWidth: '100%' }}>
      {/* Edit button */}
      {isAuthenticated && !isEditing && (
        <IconButton
          onClick={handleEditClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' },
            zIndex: 1,
          }}
        >
          <EditIcon />
        </IconButton>
      )}

      {/* Picture or Placeholder */}
      {pictureUrl ? (
        <CardMedia
          component="img"
          image={pictureUrl}
          alt={pictureData?.filename || 'Device'}
          sx={{
            height: 300,
            objectFit: 'contain',
            bgcolor: 'background.default',
            p: 2,
            opacity: isEditing && selectedFile ? 0.7 : 1,
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            console.error('Failed to load image');
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.secondary',
          }}
        >
          <ImageIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="body2">No picture available</Typography>
        </Box>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Cancel / Confirm buttons */}
      {isEditing && selectedFile && (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
          <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirm} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Confirm'}
            </Button>
          </Stack>
        </Box>
      )}
    </Card>
  );
};

export default DevicePicture;