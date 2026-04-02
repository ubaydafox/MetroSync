import { cn } from "@/utils/cn";
import React from "react";

export default function Button({
  label,
  className,
  leftIcon,
  rightIcon,
  onClick,
  disabled,
  type = "button",
}: {
  label: string | React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      onClick={onClick}
      className={cn('bg-primary relative inline-flex p-2 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-base leading-normal font-semibold disabled:cursor-not-allowed disabled:opacity-50',className)}
      disabled={disabled}
      type={type}
    >
      {leftIcon && <span>{leftIcon}</span>}
      <span>{label}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}