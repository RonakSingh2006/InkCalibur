export default function Ellipse({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse
        cx="50"
        cy="50"
        rx="34"
        ry="22"
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
    </svg>
  );
}
