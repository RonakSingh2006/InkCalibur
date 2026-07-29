interface IconProps {
  size: number;
  color: string;
}

export default function Select({ size, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      stroke={color}
      strokeWidth={1.25}
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 6l4.153 11.793a.365.365 0 0 0 .331.207a.366.366 0 0 0 .332-.207l2.184-4.793l4.787-1.994a.355.355 0 0 0 .213-.323a.355.355 0 0 0-.213-.323L6 6z" />
        <path d="M13.5 13.5l4.5 4.5" />
      </g>
    </svg>
  );
}