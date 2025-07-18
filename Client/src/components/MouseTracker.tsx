import { useEffect, useState } from "react";

const MouseTracker = ({
  children,
}: {
  children: (pos: { x: number; y: number }) => React.ReactNode;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <>{children(position)}</>;
};

export default MouseTracker;
