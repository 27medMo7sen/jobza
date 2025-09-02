"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"

interface SignatureCanvasProps {
  width?: number
  height?: number
  className?: string
  onEnd?: () => void
}

export interface SignatureCanvasRef {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
}

export const SignatureCanvas = ({ width = 500, height = 200, className = "", onEnd }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
    setIsEmpty(false)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    onEnd?.()
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const toDataURL = () => {
    const canvas = canvasRef.current
    if (!canvas) return ""
    return canvas.toDataURL()
  }

  // Expose methods through ref
  useEffect(() => {
    if (canvasRef.current) {
      ;(canvasRef.current as any).clear = clear
      ;(canvasRef.current as any).isEmpty = () => isEmpty
      ;(canvasRef.current as any).toDataURL = toDataURL
    }
  }, [isEmpty])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: "1px solid #ccc", borderRadius: "4px" }}
    />
  )
}
