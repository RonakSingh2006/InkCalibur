export default function Line({size,color} : {size : number , color : string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line
        x1="10"
        y1="90"
        x2="90"
        y2="10"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}


