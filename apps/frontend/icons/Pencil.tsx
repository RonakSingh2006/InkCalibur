export default function Pencil({size , color} : {size : number , color : string}) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <path
        d="M10 70 
           Q 25 30, 40 60 
           T 70 50 
           Q 85 45, 90 30"
        fill="none"
        stroke={color}
        strokeWidth={size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
