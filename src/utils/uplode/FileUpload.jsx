import React, { useState, useRef } from 'react';
import { useFormikContext, ErrorMessage } from 'formik';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  InputLabel
} from '@mui/material';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';

const uploadStyle = {
  uplodeBox: {
    borderRadius: 2,
    padding: 2,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
  imgBox: {
    width: '100%',
    maxHeight: 200,
    objectFit: 'contain',
    borderRadius: 8
  },
  iconBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff'
  },
  cloudIcon: {
    fontSize: '32px',
    color: '#999',
  },
  deleteIcon: {
    color: 'red',
    fontSize: '20px'
  },
  errorMsg: {
    color: 'red',
    marginTop: 4
  },
  labelPosition: {
    marginBottom: '4px',
    color: '#8c8c8c',
    fonSize: '0.875rem',
    lineHeight: '1.4375em',
    fontWeight: 400,
  },
  star: {
    color: "#FF0000"
  },
};

const FileUpload = ({ name, label, accept = 'image/*', required = false }) => {
  const { setFieldValue, values } = useFormikContext();
  const file = values[name] || null;
  const inputRef = useRef();
  const [preview, setPreview] = useState(file ? URL.createObjectURL(file) : null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const maxSize = 2 * 1024 * 1024; // 2MB

    if (selectedFile.size > maxSize) {
      setFileError('❗ File size must be less than 2 MB');
      setFieldValue(name, null);
      setPreview(null);
      return;
    }

    setFileError('');
    setFieldValue(name, selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleRemove = () => {
    setFieldValue(name, null);
    setPreview(null);
    setFileError('');
  };

  return (
    <Grid item xs={12} sm={6}>
      <InputLabel sx={uploadStyle.labelPosition}>
        {label} {required && <span style={uploadStyle.star}>*</span>}
      </InputLabel>

      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        sx={{
          ...uploadStyle.uplodeBox,
          border: `1px dashed ${fileError ? 'red' : '#aaa'}`,
        }}
      >
        {file ? (
          <Box position="relative">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={uploadStyle.imgBox}
              />
            ) : (
              <Typography variant="body2">{file.name}</Typography>
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              sx={uploadStyle.iconBtn}
            >
              <DeleteOutlined style={uploadStyle.deleteIcon} />
            </IconButton>
          </Box>
        ) : (
          <>
            <CloudUploadOutlined style={uploadStyle.cloudIcon} />
            <Typography variant="body2" color="textSecondary">
              Drag & drop or click to upload
            </Typography>
          </>
        )}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
      </Box>

      {/* File size error */}
      {fileError && (
        <Typography variant="body2" color="error" mt={1}>
          {fileError}
        </Typography>
      )}

      {/* Formik field-level error */}
      <ErrorMessage name={name} component="div" style={uploadStyle.errorMsg} />
    </Grid>
  );
};

export default FileUpload;
