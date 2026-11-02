import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Read a File/Blob as a base64 data URL (client side). */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Downscale an image client-side before upload. Keeps the longest edge at
 * `maxEdge` px and re-encodes as JPEG. This keeps requests small/fast while
 * staying sharp enough for text extraction.
 */
export async function compressImage(file: File, maxEdge = 1600, quality = 0.82): Promise<string> {
  const dataUrl = await fileToDataUrl(file)
  if (typeof document === 'undefined') return dataUrl
  try {
    const img = await loadImage(dataUrl)
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return dataUrl
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    return dataUrl
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}
