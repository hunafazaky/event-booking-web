// A simplified, geometric torii-gate silhouette with confetti around
// it — the most "festival landmark" of the four illustrations.
export default function ToriiIllustration() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="450" fill="#B8F1C4" />
      <circle cx="120" cy="80" r="16" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="680" cy="100" r="14" fill="#FFF3B0" stroke="#1A1A1A" strokeWidth="3" />
      <rect x="200" y="200" width="22" height="30" fill="#E4D6FF" stroke="#1A1A1A" strokeWidth="3" />
      <rect x="580" y="220" width="22" height="30" fill="#A8D8FF" stroke="#1A1A1A" strokeWidth="3" />

      <rect x="260" y="140" width="26" height="240" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="4" />
      <rect x="514" y="140" width="26" height="240" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="4" />
      <rect x="230" y="110" width="340" height="28" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="4" />
      <rect x="250" y="160" width="300" height="18" fill="#FFC2C2" stroke="#1A1A1A" strokeWidth="4" />
    </svg>
  )
}
