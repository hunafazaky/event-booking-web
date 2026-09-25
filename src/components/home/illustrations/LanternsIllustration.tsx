// Abstract, geometric — rows of paper lanterns. Flat shapes only, no
// gradients/photorealism, matching the neobrutalism flat-fill rule.
export default function LanternsIllustration() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="450" fill="#A8D8FF" />
      {[
        { x: 90, y: 60, fill: '#FFC2C2' },
        { x: 260, y: 140, fill: '#FFF3B0' },
        { x: 430, y: 50, fill: '#E4D6FF' },
        { x: 600, y: 130, fill: '#B8F1C4' },
        { x: 700, y: 40, fill: '#FFC2C2' },
        { x: 160, y: 250, fill: '#B8F1C4' },
        { x: 500, y: 260, fill: '#FFF3B0' },
      ].map((l, i) => (
        <g key={i}>
          <line x1={l.x} y1={l.y - 30} x2={l.x} y2={l.y - 10} stroke="#1A1A1A" strokeWidth="3" />
          <ellipse cx={l.x} cy={l.y + 30} rx="38" ry="46" fill={l.fill} stroke="#1A1A1A" strokeWidth="3" />
          <line x1={l.x - 38} y1={l.y + 10} x2={l.x + 38} y2={l.y + 10} stroke="#1A1A1A" strokeWidth="2" />
          <line x1={l.x - 38} y1={l.y + 50} x2={l.x + 38} y2={l.y + 50} stroke="#1A1A1A" strokeWidth="2" />
          <line x1={l.x} y1={l.y + 76} x2={l.x} y2={l.y + 96} stroke="#1A1A1A" strokeWidth="3" />
        </g>
      ))}
    </svg>
  )
}
