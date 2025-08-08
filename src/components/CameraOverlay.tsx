import { useCamera } from '@/hooks/useCamera'
import { TLShapeId } from '@tldraw/tldraw'
import { useEffect, useRef } from 'react'

interface CameraOverlayProps {
	shapeId: TLShapeId
	width: number
	height: number
	isVisible: boolean
	opacity?: number
}

export function CameraOverlay({
	shapeId,
	width,
	height,
	isVisible,
	opacity = 0.7,
}: CameraOverlayProps) {
	const { isActive, stream, error } = useCamera()
	const localVideoRef = useRef<HTMLVideoElement>(null)

	// Assign stream to local video element when available
	useEffect(() => {
		if (localVideoRef.current && stream && isVisible && isActive) {
			localVideoRef.current.srcObject = stream
			localVideoRef.current.play().catch(console.error)
		}
	}, [stream, isVisible, isActive])

	if (!isVisible || !isActive || error) {
		return null
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: `${width}px`,
				height: `${height}px`,
				overflow: 'hidden',
				borderRadius: '4px',
				zIndex: 0, // Behind the drawing layer
				pointerEvents: 'none', // Allow drawing over the video
			}}
		>
			<video
				ref={localVideoRef}
				autoPlay
				playsInline
				muted
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					opacity,
					display: 'block',
				}}
			/>
		</div>
	)
}

// Re-export the camera hook for convenience
export { useCamera } from '@/hooks/useCamera'
