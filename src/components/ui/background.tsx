'use client'

import { useEffect, useRef, useState } from 'react'
import FOG from 'vanta/src/vanta.halo'
import * as THREE from 'three'

export default function BackgroundHalo() {
  const [vantaEffect, setVantaEffect] = useState(0)
  const vantaRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          size: 1,
          baseColor: '#080808',
          highlightColor: '#181818',
          midtoneColor: '#282828',
        }),
      )
    }
  }, [vantaEffect])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <div
        ref={vantaRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
