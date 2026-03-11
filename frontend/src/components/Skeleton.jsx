import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const baseClass = 'skeleton-shimmer';
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-[1.5rem]';
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
