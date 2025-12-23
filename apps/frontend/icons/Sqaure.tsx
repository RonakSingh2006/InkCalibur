export default function Square({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        fill="none"
        stroke={color}
        strokeWidth="10"
      />
    </svg>
  );
}
