import { useCallback, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const ZoomableImage = ({
  src,
  alt,
  className = 'fullscreen-image',
  isMobile = false,
  allowMobilePinch = false,
  onLoad,
  onError
}) => {
  const transformRef = useRef(null)
  const skipClickRef = useRef(false)
  const panMovedRef = useRef(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const useNativeMobileImage = isMobile && !allowMobilePinch

  const handleTransformed = useCallback((_ref, state) => {
    setIsZoomed(state.scale > 1.01)
  }, [])

  const handleToggleZoom = useCallback((event) => {
    if (skipClickRef.current) {
      skipClickRef.current = false
      return
    }

    if (!transformRef.current) return

    if (isZoomed) {
      transformRef.current.resetTransform(180)
      return
    }

    const wrapperRect = event?.currentTarget?.getBoundingClientRect?.()
    const state = transformRef.current.instance?.transformState

    if (!wrapperRect || !state) {
      transformRef.current.zoomIn(1, 180, 'easeOut')
      return
    }

    const mouseX = event.clientX - wrapperRect.left
    const mouseY = event.clientY - wrapperRect.top
    const nextScale = 2.4

    const pointX = (mouseX - state.positionX) / state.scale
    const pointY = (mouseY - state.positionY) / state.scale

    const nextPositionX = mouseX - pointX * nextScale
    const nextPositionY = mouseY - pointY * nextScale

    transformRef.current.setTransform(
      nextPositionX,
      nextPositionY,
      nextScale,
      180,
      'easeOut'
    )
  }, [isZoomed])

  if (useNativeMobileImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={onLoad}
        onError={onError}
      />
    )
  }

  const cursorClass = isPanning ? 'ql-cursor-grabbing' : (isZoomed ? 'ql-cursor-zoom-out' : 'ql-cursor-zoom-in')
  const wrapperProps = useMemo(() => {
    if (isMobile) return {}
    return { onClick: handleToggleZoom }
  }, [handleToggleZoom, isMobile])

  return (
    <TransformWrapper
      minScale={1}
      maxScale={5}
      centerOnInit
      centerZoomedOut
      limitToBounds={false}
      wheel={{ step: 0.16 }}
      panning={{
        disabled: !isZoomed,
        velocityDisabled: true,
        allowLeftClickPan: true,
        wheelPanning: false
      }}
      pinch={{ disabled: false }}
      doubleClick={{ disabled: true }}
      onInit={(ref) => {
        transformRef.current = ref
      }}
      onTransformed={handleTransformed}
      onPanningStart={() => {
        setIsPanning(true)
        panMovedRef.current = false
      }}
      onPanning={() => {
        panMovedRef.current = true
      }}
      onPanningStop={() => {
        setIsPanning(false)
        if (!panMovedRef.current) return

        skipClickRef.current = true
        window.setTimeout(() => {
          skipClickRef.current = false
        }, 120)
      }}
    >
      <TransformComponent
        wrapperClass={cursorClass}
        contentClass={cursorClass}
        wrapperStyle={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        contentStyle={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        wrapperProps={wrapperProps}
      >
        <img
          src={src}
          alt={alt}
          className={`${className} ${cursorClass}`}
          onLoad={onLoad}
          onError={onError}
          draggable={false}
        />
      </TransformComponent>
    </TransformWrapper>
  )
}

export default ZoomableImage
