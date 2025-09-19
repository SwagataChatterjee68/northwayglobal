"use client"
import Topbar from '@/components/topbar/Topbar';
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
// import { toast } from 'react-toastify'; 


export default function CreateTestimonial() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    region: '',
    video_url: '',
    star: 5, // Set default value to 5 instead of empty string
    comments: ''
  });
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const imageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (optional - e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setProfileImage({
      name: file.name,
      file,
      url: URL.createObjectURL(file)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      // toast.error('Unauthorized! Please login first.');
      setIsLoading(false);
      return;
    }

    // Enhanced validation
    if (!formData.name.trim() || !formData.designation.trim()) {
      // toast.error('Please fill at least Name and Designation');
      setIsLoading(false);
      return;
    }

    // Validate star rating
    if (formData.star < 1 || formData.star > 5) {
      // toast.error('Star rating must be between 1 and 5');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('designation', formData.designation.trim());
      data.append('region', formData.region.trim());
      data.append('comments', formData.comments.trim());
      data.append('star', parseInt(formData.star)); // Ensure it's a number
      
      // Only append video_url if it's not empty
      if (formData.video_url.trim()) {
        data.append('video_url', formData.video_url.trim());
      }

      if (video?.file) {
        data.append('video_file', video.file);
      }
      
      if (profileImage?.file) {
        data.append('profile_image', profileImage.file);
      }

      console.log('Submitting data:', {
        ...formData,
        hasVideo: !!video?.file,
        hasProfileImage: !!profileImage?.file
      });

      const res = await fetch('https://nortway.mrshakil.com/api/testimonial/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success('Testimonial submitted successfully!');
        console.log(res , "check final res")
        // Reset form
        setFormData({
          name: '',
          designation: '',
          region: '',
          video_url: '',
          star: 5,
          comments: ''
        });
        setVideo(null);
        setProfileImage(null);
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      } else {
        // Handle different error scenarios
        if (res.status === 401) {
          toast.error('Unauthorized access. Please login again.');
        } else if (res.status === 413) {
          toast.error('File too large. Please upload smaller files.');
        } else if (res.status === 400) {
          // Handle validation errors
          if (responseData.errors) {
            Object.keys(responseData.errors).forEach(key => {
              toast.error(`${key}: ${responseData.errors[key].join(', ')}`);
            });
          } else {
            toast.error(responseData.detail || responseData.message || 'Invalid data submitted');
          }
        } else {
          toast.error(responseData.detail || responseData.message || 'Failed to submit testimonial');
        }
        console.error('API Error:', responseData);
      }
    } catch (err) {
      console.error('Network/Server Error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Error connecting to server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Topbar textTopbar="Create Testimonial"  />
      <div className='container'>
        <h1 className='page-title'>Create Testimonial</h1>

        <form onSubmit={handleSubmit} className='form-wrapper'>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            className='form-input'
            required
          />

          <input
            type='text'
            name='designation'
            value={formData.designation}
            onChange={handleChange}
            placeholder='Designation'
            className='form-input'
            required
          />

          <input
            type='text'
            name='region'
            value={formData.region}
            onChange={handleChange}
            placeholder='Region'
            className='form-input'
          />

          <input
            type='url'
            name='video_url'
            value={formData.video_url}
            onChange={handleChange}
            placeholder='Video URL (optional)'
            className='form-input'
          />

          <input
            type='number'
            name='star'
            placeholder='Star Rating (1-5)'
            value={formData.star}
            min={1}
            max={5}
            onChange={handleChange}
            className='form-input'
            required
          />

          <textarea
            name='comments'
            value={formData.comments}
            onChange={handleChange}
            placeholder='Comments'
            className='form-input'
            rows={4}
          />

          <div className='form-group'>
            <label>Profile Image</label>
            <input
              type='file'
              accept='image/*'
              ref={imageInputRef}
              onChange={handleImageChange}
              className='form-input'
            />
            {profileImage && (
              <div className='image-preview-container'>
                <img
                  src={profileImage.url}
                  alt={profileImage.name}
                  className='photo-preview'
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                />
                <p>{profileImage.name}</p>
              </div>
            )}
          </div>

          <button 
            type='submit' 
            className='submit-btn'
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}
