import { Float, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState, forwardRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

// ─── Flavor → label texture map ────────────────────────────────────────────
const flavorLabels = {
  blackcherry: '/textures/can-label-blackcherry.png',
  lime:        '/textures/can-label-lime.png',
  watermelon:  '/textures/can-label-watermelon.png',
  orange:      '/textures/can-label-orange.png',
  blueberry:   '/textures/can-label-blueberry.png',
}

// Preload all label textures
Object.values(flavorLabels).forEach((path) => useTexture.preload(path))

// ─── Silver aluminium material shorthand ───────────────────────────────────
const AlumMat = ({ color = '#C0C0C0', roughness = 0.05 }) => (
  <meshStandardMaterial color={color} metalness={0.95} roughness={roughness} />
)

// ─── The geometry-built can (inner) ────────────────────────────────────────
function CanMesh({ flavor }) {
  const labelPath = flavorLabels[flavor] || flavorLabels.blackcherry
  const texture = useTexture(labelPath)

  // Wrap texture correctly around the cylinder
  texture.wrapS = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.needsUpdate = true

  return (
    <group>
      {/* ── MAIN CAN BODY ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 3.2, 128, 1, true]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.6}
          roughness={0.2}
          envMapIntensity={1.2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ── TOP CAP (aluminium shoulder) ── */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.65, 0.12, 128]} />
        <AlumMat color="#C0C0C0" />
      </mesh>

      {/* ── TOP DOME ── */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.65, 64, 32, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <AlumMat color="#C8C8C8" />
      </mesh>

      {/* ── PULL TAB (ring) ── */}
      <mesh position={[0.2, 2.05, 0]} rotation={[0.3, 0, 0.1]} castShadow>
        <torusGeometry args={[0.12, 0.025, 16, 32]} />
        <meshStandardMaterial color="#A0A0A0" metalness={1} roughness={0.1} />
      </mesh>

      {/* ── PULL TAB (lever) ── */}
      <mesh position={[0.1, 1.95, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.25, 0.04, 0.08]} />
        <meshStandardMaterial color="#A0A0A0" metalness={1} roughness={0.1} />
      </mesh>

      {/* ── BOTTOM TAPER ── */}
      <mesh position={[0, -1.55, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.68, 0.15, 128]} />
        <AlumMat color="#C0C0C0" />
      </mesh>

      {/* ── BOTTOM CAP ── */}
      <mesh position={[0, -1.67, 0]} castShadow>
        <cylinderGeometry args={[0.68, 0.68, 0.08, 128]} />
        <AlumMat color="#B0B0B0" />
      </mesh>

      {/* ── BOTTOM DOME (concave indentation) ── */}
      <mesh position={[0, -1.72, 0]} castShadow>
        <sphereGeometry
          args={[0.55, 64, 32, 0, Math.PI * 2, Math.PI / 1.8, Math.PI / 3]}
        />
        <AlumMat color="#A8A8A8" />
      </mesh>

      {/* ── TOP RIM HIGHLIGHT ── */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <torusGeometry args={[0.69, 0.02, 16, 128]} />
        <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0} />
      </mesh>

      {/* ── BOTTOM RIM HIGHLIGHT ── */}
      <mesh position={[0, -1.62, 0]} castShadow>
        <torusGeometry args={[0.69, 0.02, 16, 128]} />
        <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0} />
      </mesh>
    </group>
  )
}

// ─── Main SodaCan component ────────────────────────────────────────────────
const SodaCan = forwardRef(
  ({ flavor = 'blackcherry', scale = 2, position = [0, 0, 0], instantSwap = false, ...props }, ref) => {
    const internalRef = useRef()
    const canRef = ref || internalRef
    const spinRef = useRef() // inner group for GSAP spin
    const [activeFlavor, setActiveFlavor] = useState(flavor)
    const opacityRef = useRef(1)
    const meshGroupRef = useRef()

    // Continuous slow Y-axis spin
    useFrame((_state, delta) => {
      if (canRef.current) {
        canRef.current.rotation.y += delta * 0.4
      }
    })

    // Drive material opacity via useFrame
    useFrame(() => {
      if (meshGroupRef.current) {
        meshGroupRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true
            child.material.opacity = opacityRef.current
          }
        })
      }
    })

    // Flavor swap: instant (for slide mode) or GSAP spin+fade
    useEffect(() => {
      if (flavor === activeFlavor) return

      if (instantSwap) {
        // Just swap texture immediately; slide animation owns the transition
        setActiveFlavor(flavor)
        opacityRef.current = 1
        return
      }

      // Spin 360° while swapping
      if (canRef.current) {
        gsap.to(canRef.current.rotation, {
          y: canRef.current.rotation.y + Math.PI * 2,
          duration: 0.8,
          ease: 'power2.inOut',
        })
      }

      // Fade out → swap → fade in
      gsap.to(opacityRef, {
        current: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setActiveFlavor(flavor)
          gsap.to(opacityRef, {
            current: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        },
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flavor])

    return (
      <Float floatIntensity={1.5} speed={2} rotationIntensity={0.3}>
        <group ref={canRef} scale={scale} position={position} {...props}>
          <group ref={meshGroupRef}>
            <CanMesh flavor={activeFlavor} />
          </group>
        </group>
      </Float>
    )
  }
)

SodaCan.displayName = 'SodaCan'
export default SodaCan
