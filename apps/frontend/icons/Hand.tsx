export default function Hand({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        transform="translate(9, 0)"
        d="
          M35 55
          V30
          C35 26 41 26 41 30
          V52

          V28
          C41 24 47 24 47 28
          V52

          V30
          C47 26 53 26 53 30
          V55

          V34
          C53 30 59 30 59 34
          V60

          C59 70 50 78 40 78
          C30 78 25 70 25 62
          V55
          Z
        "
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
