export function ShopFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ShopFlow Logo"
    >
      {/* Gear outer */}
      <path
        d="M20 2l3 4.5h5.2l1.8 4.9L34.5 14l.5 5.2-3.5 3.8L33 28.2l-4.5 2.5-3.5 3.8H19.5l-3.5-3.8L11.5 28.2 8 23l.5-5.2L13 14l1.8-4.9H20z"
        fill="none"
        stroke="hsl(22, 85%, 52%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inner gear ring */}
      <circle cx="20" cy="20" r="10" stroke="hsl(22, 85%, 52%)" strokeWidth="2.5" fill="none" />
      {/* Wrench / S shape */}
      <path
        d="M16 15c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-1.8 2-4 3-4 1.5-4 3 1.8 2.5 4 2.5 4-1 4-2.5"
        stroke="hsl(22, 85%, 52%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ShopFlowLogoFull() {
  return (
    <div className="flex items-center gap-2.5">
      <ShopFlowLogo size={32} />
      <span
        className="text-lg font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ShopFlow
      </span>
    </div>
  );
}
