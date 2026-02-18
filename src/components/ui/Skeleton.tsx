import React from 'react';
import styles from './Skeleton.module.css';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export default function Skeleton({
  width,
  height,
  borderRadius,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, className)}
      style={{ width, height, borderRadius, ...style }}
      {...props}
    />
  );
}
