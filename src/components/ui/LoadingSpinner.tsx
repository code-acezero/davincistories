const LoadingSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
    <div className="relative w-16 h-16">
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: "hsl(var(--primary))",
          borderRightColor: "hsl(var(--copper))",
          animation: "rotate360 1s linear infinite",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className="absolute inset-2 rounded-full border-2 border-transparent"
        style={{
          borderBottomColor: "hsl(var(--ocean-teal))",
          borderLeftColor: "hsl(var(--secondary))",
          animation: "rotate360 1.5s linear infinite reverse",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          width: "calc(100% - 16px)",
          height: "calc(100% - 16px)",
        }}
      />
    </div>
  </div>
);

export default LoadingSpinner;
