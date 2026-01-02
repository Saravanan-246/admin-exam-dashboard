export default function GlowButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        `w-full py-3 rounded-xl font-semibold bg-gradient-to-r 
        from-blue-600 to-indigo-500 hover:scale-[1.02] active:scale-95 
        transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] 
        hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] ${className}`
      }
    >
      {children}
    </button>
  );
}
