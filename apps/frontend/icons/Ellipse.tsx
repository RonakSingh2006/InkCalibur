export default function Ellipse({size , color} : {size : number , color : string}) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="20"
        fill="none"
        stroke={color}
        strokeWidth={size}
      />
    </svg>
  );
}
