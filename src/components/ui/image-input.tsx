'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'

interface ImageInputProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
}

export function ImageInput({ value, onChange, placeholder = 'Paste image URL or drag & drop...' }: ImageInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError('')

    try {
      // For now, we'll create a local object URL
      // In production, upload to Firebase Storage
      const formData = new FormData()
      formData.append('file', file)

      // TODO: Replace with actual Firebase Storage upload
      // For now, show message to use URL instead
      setError('File upload coming soon! Please use image URL for now.')
      setIsUploading(false)
      
      // Uncomment when Firebase Storage is set up:
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const data = await response.json()
      // if (data.success) {
      //   onChange(data.url)
      // }
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    onChange(e.target.value)
  }

  const handleRemove = () => {
    onChange('')
    setError('')
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-3">
      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${isUploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
        />
        
        {value && isValidUrl(value) ? (
          <div className="space-y-2">
            <img
              src={value}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-cover"
              onError={() => setError('Failed to load image')}
            />
            <p className="text-sm text-muted-foreground">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Drag & drop image here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
