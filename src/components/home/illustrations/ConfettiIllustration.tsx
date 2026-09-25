// Scattered confetti — circles, squares, and short bars across the
// canvas. The simplest of the four, used as a lighter palette-change
// beat between the more structured illustrations.
export default function ConfettiIllustration() {
  const shapes = [
    { x: 80, y: 90, r: 18, fill: '#FFC2C2', type: 'circle' },
    { x: 200, y: 60, fill: '#FFF3B0', type: 'square' },
    { x: 340, y: 130, r: 14, fill: '#B8F1C4', type: 'circle' },
    { x: 460, y: 70, fill: '#E4D6FF', type: 'square' },
    { x: 600, y: 110, r: 20, fill: '#A8D8FF', type: 'circle' },
    { x: 700, y: 60, fill: '#FFC2C2', type: 'square' },
    { x: 120, y: 260, fill: '#B8F1C4', type: 'square' },
    { x: 280, y: 300, r: 16, fill: '#FFF3B0', type: 'circle' },
    { x: 420, y: 250, fill: '#A8D8FF', type: 'square' },
    { x: 560, y: 310, r: 18, fill: '#E4D6FF', type: 'circle' },
    { x: 680, y: 260, fill: '#FFC2C2', type: 'square' },
  ]
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="450" fill="#FFF3B0" />
      {shapes.map((s, i) =>
        s.type === 'circle' ? (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} stroke="#1A1A1A" strokeWidth="3" />
        ) : (
          <rect
            key={i}
            x={s.x - 16}
            y={s.y - 16}
            width="32"
            height="32"
            fill={s.fill}
            stroke="#1A1A1A"
            strokeWidth="3"
            transform={`rotate(${(i * 17) % 45} ${s.x} ${s.y})`}
          />
        ),
      )}
    </svg>
  )
}
