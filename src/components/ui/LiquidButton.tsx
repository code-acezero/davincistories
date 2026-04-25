import { forwardRef, useRef, type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "glass";
type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-3 text-sm",
  lg: "px-9 py-4 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  className?: string;
  children: ReactNode;
}

type Props = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref">;

const variantClass: Record<Variant, string> = {
  primary: "liquid-btn text-primary-foreground",
  ghost: "liquid-btn-ghost text-foreground",
  glass: "glass-card-strong text-foreground hover:border-primary/40",
};

const spawnRipple = (e: MouseEvent<HTMLElement>) => {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "liquid-ripple";
  const size = Math.max(8, Math.min(rect.width, rect.height) / 6);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 850);
};

const LiquidButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({ variant = "primary", size = "md", to, href, className, children, onClick, ...rest }, ref) => {
    const baseRef = useRef<HTMLElement | null>(null);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      spawnRipple(e);
      onClick?.(e as MouseEvent<HTMLButtonElement>);
    };

    const cls = cn(
      "relative inline-flex items-center justify-center gap-2 rounded-full font-medium overflow-hidden select-none",
      variantClass[variant],
      sizeMap[size],
      className
    );

    if (to) {
      return (
        <Link
          to={to}
          ref={(el) => {
            baseRef.current = el;
            if (typeof ref === "function") ref(el as never);
          }}
          className={cls}
          onClick={handleClick}
        >
          {children}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} ref={ref as never} className={cls} onClick={handleClick}>
          {children}
        </a>
      );
    }
    return (
      <button ref={ref as never} className={cls} onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  }
);
LiquidButton.displayName = "LiquidButton";

export default LiquidButton;
