'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import './create-testimonial.css'
import Topbar from '@/components/topbar/Topbar'
import { LuMessageSquareText } from "react-icons/lu";


export default function CreateTestimonial () {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    region: '',
    video_url: '',
    star: '',
    comments: ''
  })
  const [video, setVideo] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const imageInputRef = useRef(null)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setProfileImage({
      name: file.name,
      file,
      url: URL.createObjectURL(file)
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    if (!formData.name || !formData.designation) {
      toast.error('Please fill at least Name and Designation')
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('designation', formData.designation)
      data.append('region', formData.region)
      data.append('comments', formData.comments)
      data.append('star', formData.star)
      data.append('video_url', formData.video_url)

      if (video?.file) data.append('video_file', video.file)
      if (profileImage?.file) data.append('profile_image', profileImage.file)

      const res = await fetch('https://nortway.mrshakil.com/api/testimonial/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`
        },
        body: data
      })

      if (res.ok) {
        toast.success('Testimonial submitted successfully!')
        setFormData({
          name: '',
          designation: '',
          region: '',
          video_url: '',
          star: 5,
          comments: ''
        })
        setVideo(null)
        setProfileImage(null)
        if (imageInputRef.current) imageInputRef.current.value = ''
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to submit testimonial')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error connecting to server')
    }
  }

  return (
    <section>
      <Topbar textTopbar="Create Testimonial" topBarIcon = {LuMessageSquareText}/>
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
          />

          <input
            type='text'
            name='designation'
            value={formData.designation}
            onChange={handleChange}
            placeholder='Designation'
            className='form-input'
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
            type='text'
            name='video_url'
            value={formData.video_url}
            onChange={handleChange}
            placeholder='Video URL (optional)'
            className='form-input'
          />

          <input
            type='number'
            name='star'
            placeholder='star'
            value={formData.star}
            min={1}
            max={5}
            onChange={handleChange}
            className='form-input'
          />

          <textarea
            name='comments'
            value={formData.comments}
            onChange={handleChange}
            placeholder='Comments'
            className='form-input'
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
              <img
                src={profileImage.url}
                alt={profileImage.name}
                className='photo-preview'
              />
            )}
          </div>

          <button type='submit' className='submit-btn'>
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}
