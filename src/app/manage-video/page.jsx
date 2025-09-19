'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import './manage-video.css'
import Topbar from '@/components/topbar/Topbar'
import { FaVideo } from "react-icons/fa6";

export default function ManageVideos () {
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  // Fetch videos
  useEffect(() => {
    fetch('https://nortway.mrshakil.com/api/gallery/video/')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Error fetching videos:', err))
  }, [])

  const handleUpload = async () => {
    if (!title || !videoUrl) {
      toast.error('Please provide both title and video URL!')
      return
    }

    try {
      const res = await fetch(
        'https://nortway.mrshakil.com/api/gallery/video/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, videoUrl })
        }
      )

      if (!res.ok) throw new Error('Upload failed')

      const savedVideo = await res.json()
      setVideos(prev => [...prev, savedVideo])

      // reset form
      setTitle('')
      setVideoUrl('')
      toast.success('Video uploaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error uploading video')
    }
  }

  const handleDelete = async id => {
    try {
      await fetch(`https://nortway.mrshakil.com/api/gallery/video/${id}/`, {
        method: 'DELETE'
      })
      setVideos(videos.filter(v => v.id !== id))
      toast.success('Video deleted!')
    } catch (err) {
      console.error(err)
      toast.error('Error deleting video')
    }
  }

  return (
    <section>
      <Topbar textTopbar='Manage Videos' topBarIcon={FaVideo} />
      <div className='page-container'>
        <h1 className='page-title'>Manage Videos</h1>

        {/* Form */}
        <div className='form-wrapper'>
          <label className='form-label'>
            Video Title
            <input
              type='text'
              placeholder='Enter video title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='form-input'
            />
          </label>

          <label className='form-label'>
            Video URL
            <input
              type='text'
              placeholder='https://example.com/video.mp4'
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className='form-input'
            />
          </label>

          <button onClick={handleUpload} className='submit-btn'>
            Upload
          </button>
        </div>

        {/* List */}
        {videos.length > 0 && (
          <div className='videos-grid'>
            {videos.map(video => (
              <div key={video.id} className='video-item'>
                <video
                  src={video.videoUrl}
                  controls
                  className='video-preview'
                />
                <p className='video-name'>{video.title}</p>
                <button
                  onClick={() => handleDelete(video.id)}
                  className='video-delete'
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
