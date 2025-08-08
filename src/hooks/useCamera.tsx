import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export interface CameraState {
	isActive: boolean
	stream: MediaStream | null
	error: string | null
	isLoading: boolean
}

interface CameraContextType extends CameraState {
	videoRef: React.RefObject<HTMLVideoElement>
	startCamera: () => Promise<void>
	stopCamera: () => void
	toggleCamera: () => void
}

const CameraContext = createContext<CameraContextType | null>(null)

export function CameraProvider({ children }: { children: React.ReactNode }) {
	const [cameraState, setCameraState] = useState<CameraState>({
		isActive: false,
		stream: null,
		error: null,
		isLoading: false,
	})

	const videoRef = useRef<HTMLVideoElement>(null)

	const startCamera = useCallback(async () => {
		setCameraState((prev) => ({ ...prev, isLoading: true, error: null }))

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: 'environment', // Use back camera on mobile
				},
				audio: false,
			})

			setCameraState({
				isActive: true,
				stream,
				error: null,
				isLoading: false,
			})
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to access camera'
			setCameraState({
				isActive: false,
				stream: null,
				error: errorMessage,
				isLoading: false,
			})
		}
	}, [])

	const stopCamera = useCallback(() => {
		if (cameraState.stream) {
			cameraState.stream.getTracks().forEach((track) => track.stop())
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null
		}

		setCameraState({
			isActive: false,
			stream: null,
			error: null,
			isLoading: false,
		})
	}, [cameraState.stream])

	const toggleCamera = useCallback(() => {
		if (cameraState.isActive) {
			stopCamera()
		} else {
			startCamera()
		}
	}, [cameraState.isActive, startCamera, stopCamera])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (cameraState.stream) {
				cameraState.stream.getTracks().forEach((track) => track.stop())
			}
		}
	}, [cameraState.stream])

	const contextValue: CameraContextType = {
		...cameraState,
		videoRef,
		startCamera,
		stopCamera,
		toggleCamera,
	}

	return <CameraContext.Provider value={contextValue}>{children}</CameraContext.Provider>
}

export function useCamera() {
	const context = useContext(CameraContext)
	if (!context) {
		throw new Error('useCamera must be used within a CameraProvider')
	}
	return context
}
