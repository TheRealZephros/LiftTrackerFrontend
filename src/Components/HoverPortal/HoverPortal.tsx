import { createPortal } from "react-dom";
import { ReactNode, useEffect, useState } from "react";

interface HoverPortalProps {
  children: ReactNode;
}

const HoverPortal = ({ children }: HoverPortalProps) => {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    const portalRoot = document.getElementById("hover-portal");
    if (portalRoot) setPortalContainer(portalRoot);
  }, []);

  if (!portalContainer) return null;

  return createPortal(children, portalContainer);
};

export default HoverPortal;
