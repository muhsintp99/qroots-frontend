// AddEdit.jsx (no changes needed)
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Grid, Chip, InputLabel, FormControl, Select, Box,
  Typography
} from '@mui/material';

const categoryOptions = [
  'Graduate', 'Postgraduate', 'Diploma', 'PhD', 'other'
];

const AddEdit = ({ open, handleClose, editData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    duration: '',
    category: '',
    customCategory: '',
    mode: '',
    fees: '',
    syllabus: [],
    prerequisites: [],
    tags: [],
    image: null,
  });
  const [inputSyllabus, setInputSyllabus] = useState('');
  const [inputPrerequisites, setInputPrerequisites] = useState('');
  const [inputTags, setInputTags] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        customCategory: categoryOptions.includes(editData.category) ? '' : editData.category,
        category: categoryOptions.includes(editData.category) ? editData.category : 'other',
        image: null,
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        duration: '',
        category: '',
        customCategory: '',
        mode: '',
        fees: '',
        syllabus: [],
        prerequisites: [],
        tags: [],
        image: null,
      });
      setInputSyllabus('');
      setInputPrerequisites('');
      setInputTags('');
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    if (field === 'syllabus') setInputSyllabus(value);
    else if (field === 'prerequisites') setInputPrerequisites(value);
    else if (field === 'tags') setInputTags(value);
  };

  const handleAddToArray = (field) => {
    let newItem;
    if (field === 'syllabus') newItem = inputSyllabus.trim();
    else if (field === 'prerequisites') newItem = inputPrerequisites.trim();
    else if (field === 'tags') newItem = inputTags.trim();

    if (newItem) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem]
      }));
      if (field === 'syllabus') setInputSyllabus('');
      else if (field === 'prerequisites') setInputPrerequisites('');
      else if (field === 'tags') setInputTags('');
    }
  };

  const handleDeleteFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddToArray(field);
    }
  };

  const handleFormSubmit = () => {
    if (!formData.title || !formData.shortDescription || !formData.fullDescription ||
        !formData.duration || !formData.category || !formData.mode || !formData.fees ||
        (formData.category === 'other' && !formData.customCategory)) {
      alert('Please fill all required fields');
      return;
    }

    const categoryToSave = formData.category === 'other' ? formData.customCategory : formData.category;
    onSubmit({ ...formData, category: categoryToSave });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{editData ? 'Edit Course' : 'Add Course'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.title}
              helperText={!formData.title ? 'Title is required' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Short Description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              fullWidth
              multiline
              maxRows={3}
              inputProps={{ maxLength: 300 }}
              required
              error={!formData.shortDescription}
              helperText={!formData.shortDescription ? 'Short description is required' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Full Description"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              error={!formData.fullDescription}
              helperText={!formData.fullDescription ? 'Full description is required' : ''}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.duration}
              helperText={!formData.duration ? 'Duration is required' : ''}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categoryOptions.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.category === 'other' && (
            <Grid item xs={12}>
              <TextField
                label="Custom Category"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                fullWidth
                required
                error={formData.category === 'other' && !formData.customCategory}
                helperText={formData.category === 'other' && !formData.customCategory ? 'Custom category is required' : ''}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.mode}>
              <InputLabel>Mode</InputLabel>
              <Select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                label="Mode"
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fees"
              name="fees"
              type="number"
              value={formData.fees}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.fees}
              helperText={!formData.fees ? 'Fees is required' : ''}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Image"
              name="image"
              type="file"
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
            {editData && editData.image && (
              <Box mt={1}>
                <Typography>Current Image:</Typography>
                <img src={editData.image} alt="Current course" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Syllabus (Press Enter to add)"
              value={inputSyllabus}
              onChange={(e) => handleArrayInputChange(e, 'syllabus')}
              onKeyPress={(e) => handleKeyPress(e, 'syllabus')}
              fullWidth
              helperText="Enter syllabus items one at a time and press Enter"
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.syllabus.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('syllabus', index)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Prerequisites (Press Enter to add)"
              value={inputPrerequisites}
              onChange={(e) => handleArrayInputChange(e, 'prerequisites')}
              onKeyPress={(e) => handleKeyPress(e, 'prerequisites')}
              fullWidth
              helperText="Enter prerequisites one at a time and press Enter"
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.prerequisites.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('prerequisites', index)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tags (Press Enter to add)"
              value={inputTags}
              onChange={(e) => handleArrayInputChange(e, 'tags')}
              onKeyPress={(e) => handleKeyPress(e, 'tags')}
              fullWidth
              helperText="Enter tags one at a time and press Enter"
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.tags.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('tags', index)}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleFormSubmit}>
          {editData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEdit;