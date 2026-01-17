export default function GlowButton({
  children,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2";

  const enabled =
    "bg-[#238636] text-white hover:bg-[#2EA043] active:scale-95 shadow-md hover:shadow-lg focus:ring-[#2EA043]/60";

  const disabledStyle =
    "bg-[#161B22] text-[#6E7681] cursor-not-allowed opacity-60";

  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className={`${base} ${disabled ? disabledStyle : enabled} ${className}`}
    >
      {children}
    </button>
  );
}
