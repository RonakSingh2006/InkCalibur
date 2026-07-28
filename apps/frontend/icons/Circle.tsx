export default function Circle({size,color} : {size : number , color : string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />
    </svg>
  );
}