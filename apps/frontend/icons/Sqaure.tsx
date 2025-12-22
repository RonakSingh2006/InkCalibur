export default function Square({size,color} : {size : number , color : string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke={color}
        strokeWidth="10"
      />
    </svg>
  );
}
