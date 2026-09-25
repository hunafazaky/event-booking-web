// Abstract folded-paper triangles — a nod to origami without drawing
// a literal crane. Flat geometric shapes, hard black outlines.
export default function OrigamiIllustration() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="450" fill="#E4D6FF" />
      <polygon points="150,80 280,80 215,220" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="215,220 280,80 340,220" fill="#FFF3B0" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="480,60 620,140 480,220" fill="#B8F1C4" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="480,220 620,140 620,260" fill="#A8D8FF" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="600,300 700,300 650,400" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="80,300 180,340 90,400" fill="#FFF3B0" stroke="#1A1A1A" strokeWidth="3" />
      <polygon points="320,320 420,300 400,410" fill="#A8D8FF" stroke="#1A1A1A" strokeWidth="3" />
    </svg>
  )
}
