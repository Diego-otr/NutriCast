"use client";

import { MouseEvent } from "react";

export type ButtonVariant = "default" | "pressed";

interface UseButtonVariantParams {
  variant?: ButtonVariant;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function useButtonVariant({ variant = "default", onClick }: UseButtonVariantParams = {}) {
  const isPressed = variant === "pressed";

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return {
    variant,
    isPressed,
    handleClick,
  };
}
