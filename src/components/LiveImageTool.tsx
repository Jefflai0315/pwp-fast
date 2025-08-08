import { FrameShapeTool, useEditor } from '@tldraw/tldraw'
import { useCallback, useState } from 'react'
import { useCamera } from './CameraOverlay'

export class LiveImageTool extends FrameShapeTool {
	static override id = 'live-image'
	static override initial = 'idle'
	override shapeType = 'live-image'
}

export function MakeLiveButton() {
	const editor = useEditor()
	const camera = useCamera()
	const [showCameraControls, setShowCameraControls] = useState(false)

	const makeLive = useCallback(() => {
		editor.setCurrentTool('live-image')
	}, [editor])

	const toggleCameraControls = useCallback(() => {
		setShowCameraControls((prev) => !prev)
	}, [])

	return (
		<div className="draw-fast-controls">
			<button onClick={makeLive} className="draw-fast-button">
				<div className="draw-fast-button__inner">Draw Fast</div>
			</button>

			<button
				onClick={toggleCameraControls}
				className="draw-fast-button camera-button"
				style={{
					marginLeft: '8px',
					backgroundColor: camera.isActive ? 'var(--color-accent)' : 'var(--color-panel)',
				}}
			>
				<div className="draw-fast-button__inner">📷 Camera</div>
			</button>

			{showCameraControls && (
				<div
					className="camera-controls"
					style={{
						position: 'absolute',
						top: '100%',
						right: 0,
						background: 'var(--color-panel)',
						border: '1px solid var(--color-border)',
						borderRadius: '8px',
						padding: '8px',
						marginTop: '4px',
						display: 'flex',
						flexDirection: 'column',
						gap: '4px',
						minWidth: '150px',
						zIndex: 1000,
					}}
				>
					<div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
						Camera Status: {camera.isActive ? 'Active' : 'Inactive'}
					</div>

					{camera.error && (
						<div style={{ fontSize: '12px', color: 'var(--color-warn)' }}>
							Error: {camera.error}
						</div>
					)}

					<button
						onClick={camera.isActive ? camera.stopCamera : camera.startCamera}
						disabled={camera.isLoading}
						style={{
							padding: '4px 8px',
							fontSize: '12px',
							backgroundColor: camera.isActive ? 'var(--color-warn)' : 'var(--color-accent)',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: camera.isLoading ? 'not-allowed' : 'pointer',
						}}
					>
						{camera.isLoading ? 'Loading...' : camera.isActive ? 'Stop Camera' : 'Start Camera'}
					</button>

					<div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '4px' }}>
						Use camera button in frame to enable overlay
					</div>
				</div>
			)}
		</div>
	)
}
