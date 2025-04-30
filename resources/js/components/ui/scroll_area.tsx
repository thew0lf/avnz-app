import * as React from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`overflow-auto rounded ${className}`}
        {...props}
      />
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;