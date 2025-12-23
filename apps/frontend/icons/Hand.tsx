export default function Hand({size , color} : {size : number , color : string}) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <path
        d="
          M30 55
          V30
          C30 26 36 26 36 30
          V52

          V28
          C36 24 42 24 42 28
          V52

          V30
          C42 26 48 26 48 30
          V55

          V34
          C48 30 54 30 54 34
          V60

          C54 70 45 78 35 78
          C25 78 20 70 20 62
          V55
          Z
        "
        fill="none"
        stroke={color}
        strokeWidth={size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
