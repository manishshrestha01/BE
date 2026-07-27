import { useMemo, useId } from 'react'
import { motion } from 'motion/react'

const NODE_SIZES = { sm: 18, md: 28, lg: 40 }

function CircuitBoard({
  nodes = [],
  connections = [],
  width = 900,
  height = 400,
  gridSize = 20,
  className = '',
}) {
  const uid = useId().replace(/:/g, '')
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  const manhattanPath = (from, to) => {
    const fs = (NODE_SIZES[from.size] || NODE_SIZES.md) / 2 + 6
    const ts = (NODE_SIZES[to.size] || NODE_SIZES.md) / 2 + 6
    const dx = to.x - from.x
    const dy = to.y - from.y

    let sx = from.x, sy = from.y, ex = to.x, ey = to.y
    if (Math.abs(dx) >= Math.abs(dy)) {
      sx += dx > 0 ? fs : -fs
      ex += dx > 0 ? -ts : ts
      const mid = from.x + dx * 0.5
      return `M${sx},${sy} H${mid} V${ey} H${ex}`
    } else {
      sy += dy > 0 ? fs : -fs
      ey += dy > 0 ? -ts : ts
      const mid = from.y + dy * 0.5
      return `M${sx},${sy} V${mid} H${ex} V${ey}`
    }
  }

  const extractTurns = (d) => {
    const pts = []
    const re = /([HV])([-\d.]+)/g
    let m, cx = 0, cy = 0
    while ((m = re.exec(d))) {
      if (m[1] === 'H') { cx = +m[2]; pts.push([cx, cy]) }
      else { cy = +m[2]; pts.push([cx, cy]) }
    }
    return pts
  }

  return (
    <div className={`pcb ${className}`} style={{ width, height }}>
      <svg
        width={width} height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="pcb-svg"
      >
        <defs>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`${uid}-chip-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
          </filter>

          <pattern id={`${uid}-grid`} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <circle cx={gridSize / 2} cy={gridSize / 2} r="0.4" fill="rgba(0,0,0,0.06)" />
          </pattern>

          <pattern id={`${uid}-crosshatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.015)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Board substrate */}
        <rect width={width} height={height} fill="url(#${uid}-grid)" />
        <rect width={width} height={height} fill={`url(#${uid}-crosshatch)`} />

        {/* Copper ground fills — subtle filled rectangles in empty areas */}
        {[
          [20, 20, 160, 80],
          [700, 20, 180, 80],
          [20, 300, 180, 80],
          [700, 300, 180, 80],
          [350, 300, 200, 80],
          [350, 20, 200, 60],
        ].map(([x, y, w, h], i) => (
          <rect
            key={`fill-${i}`}
            x={x} y={y} width={w} height={h} rx="4"
            fill="rgba(0,0,0,0.025)"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="0.5"
          />
        ))}

        {/* Traces */}
        {connections.map((conn, i) => {
          const from = nodeMap.get(conn.from)
          const to = nodeMap.get(conn.to)
          if (!from || !to) return null
          const d = manhattanPath(from, to)
          const turns = extractTurns(d)
          const viaRadius = 3.5

          return (
            <g key={i} className="pcb-trace-group">
              {/* Trace shadow */}
              <path d={d} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Main copper trace */}
              <motion.path
                d={d} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
              {/* Trace highlight */}
              <path d={d} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />

              {/* Vias at turns */}
              {turns.map(([tx, ty], ti) => (
                <g key={`v-${i}-${ti}`}>
                  <circle cx={tx} cy={ty} r={viaRadius} fill="rgba(0,0,0,0.15)" />
                  <circle cx={tx} cy={ty} r={viaRadius - 1.5} fill="rgba(255,255,255,0.6)" />
                  <circle cx={tx} cy={ty} r={1} fill="rgba(0,0,0,0.2)" />
                </g>
              ))}

              {/* Animated data pulse */}
              {conn.animated !== false && (
                <motion.circle
                  r="4" fill="var(--landing-accent, #0066ff)" filter={`url(#${uid}-glow)`}
                  opacity="0.9"
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%' }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.3,
                  }}
                  style={{ offsetPath: `path('${d}')` }}
                />
              )}
            </g>
          )
        })}

        {/* IC Chips / Nodes */}
        {nodes.map((node, i) => {
          const rawSize = NODE_SIZES[node.size] || NODE_SIZES.md
          const isChip = node.shape === 'chip' || node.shape === 'rect'
          const isCircle = node.shape === 'circle'

          if (isChip) {
            const chipW = rawSize * 1.8
            const chipH = rawSize
            const pins = node.pins || 4
            const pinW = 2
            const pinGap = chipW / (pins + 1)
            const pinLen = 6

            return (
              <g key={node.id} className="pcb-chip" filter={`url(#${uid}-chip-shadow)`}>
                {/* Chip body */}
                <motion.rect
                  x={node.x - chipW / 2} y={node.y - chipH / 2}
                  width={chipW} height={chipH} rx="3"
                  fill="#e8e8e8" stroke="rgba(0,0,0,0.2)" strokeWidth="1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 200 }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
                {/* Pin 1 marker (notch) */}
                <circle cx={node.x - chipW / 2 + 5} cy={node.y - chipH / 2 + 5} r="2"
                  fill="rgba(0,0,0,0.1)" />
                {/* Pins top */}
                {Array.from({ length: pins }, (_, p) => {
                  const px = node.x - chipW / 2 + pinGap * (p + 1)
                  return (
                    <g key={`pt-${p}`}>
                      <rect x={px - pinW / 2} y={node.y - chipH / 2 - pinLen}
                        width={pinW} height={pinLen} fill="rgba(0,0,0,0.2)" rx="0.5" />
                      <rect x={px - pinW / 2} y={node.y + chipH / 2}
                        width={pinW} height={pinLen} fill="rgba(0,0,0,0.2)" rx="0.5" />
                    </g>
                  )
                })}
                {/* Label */}
                {node.label && (
                  <text x={node.x} y={node.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="8" fontWeight="600" fill="rgba(0,0,0,0.45)"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            )
          }

          // Circle node (step nodes, vias, etc)
          return (
            <g key={node.id} className="pcb-node">
              <motion.circle
                cx={node.x} cy={node.y} r={rawSize / 2}
                fill={node.status === 'active' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)'}
                stroke={node.status === 'active' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}
                strokeWidth="1.5"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 200 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              {node.status === 'active' && (
                <motion.circle
                  cx={node.x} cy={node.y} r={rawSize / 2 + 4}
                  fill="none" stroke="var(--landing-accent, #0066ff)"
                  strokeWidth="1" opacity="0.25"
                  animate={{ r: [rawSize / 2 + 4, rawSize / 2 + 10, rawSize / 2 + 4], opacity: [0.25, 0, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {node.icon && (
                <text x={node.x} y={node.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={rawSize * 0.45}
                >
                  {node.icon}
                </text>
              )}
              {node.label && (
                <text x={node.x} y={node.y + rawSize / 2 + 14}
                  textAnchor="middle" fontSize="10" fontWeight="500"
                  fill="rgba(0,0,0,0.4)" fontFamily="system-ui, sans-serif"
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default CircuitBoard
