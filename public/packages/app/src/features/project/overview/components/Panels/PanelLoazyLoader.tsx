import { Setter } from "@traceo/types";
import { FC, useEffect, useRef } from "react";

/**
 * Lazy lodader for panels in dashboard to load datasource only when panel is visible for user.
 * Use onVisibleChange callback.
 */

interface Props {
  onVisibleChange: Setter<boolean>;
}
export const PanelLazyLoader: FC<Props> = ({ children, onVisibleChange }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      // percentage of panel visibility required to trigger the callback
      threshold: 0.15
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;
        onVisibleChange(entry.isIntersecting);

        if (isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    };

    const panelObserver = new IntersectionObserver(handleIntersection, options);

    if (panelRef.current) {
      panelObserver.observe(panelRef.current);
    }

    return () => {
      if (panelRef.current) {
        panelObserver.unobserve(panelRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full" ref={panelRef}>
      {children}
    </div>
  );
};
