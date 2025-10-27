// DraggableButton.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";

type Pos = { x: number; y: number };

export default function DraggableButton({
  btnName,
  func,
}: {
  btnName: string;
  func: () => void;
}) {
  const [pos, setPos] = useState<Pos>({ x: 20, y: 20 });
  const draggingRef = useRef(false);
  const startRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // get parent as container
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // find nearest positioned ancestor
    if (btnRef.current) {
      containerRef.current = btnRef.current.parentElement;
    }

    const onPointerMove = (e: PointerEvent) => {
      if (
        !draggingRef.current ||
        !startRef.current ||
        !containerRef.current ||
        !btnRef.current
      )
        return;
      const { pointerX, pointerY, startX, startY } = startRef.current;
      const dx = e.clientX - pointerX;
      const dy = e.clientY - pointerY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btnRef.current.getBoundingClientRect();

      let newX = startX + dx;
      let newY = startY + dy;

      // clamp inside parent
      const maxX = containerRect.width - btnRect.width;
      const maxY = containerRect.height - btnRect.height;
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;

      setPos({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      startRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = true;
    startRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    e.preventDefault();
  };

  return (
    <Button
      onClick={func}
      ref={btnRef}
      variant="contained"
      onPointerDown={onPointerDown}
      sx={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {btnName}
    </Button>
  );
}
