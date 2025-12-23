export default function Pencil({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M14 70 
           Q 30 28, 46 56 
           T 76 46 
           Q 86 42, 92 30"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
