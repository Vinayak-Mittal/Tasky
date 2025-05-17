import React from 'react';

// This is a simple implementation of motion animations for our app
// It provides the basic functionality we need without external dependencies

interface MotionProps {
  className?: string;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  layout?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

type HTMLMotionComponents = {
  [K in keyof JSX.IntrinsicElements]: (props: MotionProps & JSX.IntrinsicElements[K]) => JSX.Element;
};

// A simple implementation that applies CSS transitions
function createMotionComponent<T extends keyof JSX.IntrinsicElements>(element: T) {
  return function MotionComponent({ 
    initial, 
    animate, 
    exit,
    transition,
    layout,
    onHoverStart,
    onHoverEnd,
    className,
    style = {},
    ...props 
  }: MotionProps & JSX.IntrinsicElements[T]) {
    // Create default transition style
    const transitionStyle = {
      transition: 'all 0.3s ease',
      ...style
    };
    
    // Here we would normally calculate styles based on initial, animate, etc.
    // For now, we're just passing things through
    
    const Component = element as keyof JSX.IntrinsicElements;
    
    return React.createElement(Component, {
      className,
      style: transitionStyle,
      onMouseEnter: onHoverStart,
      onMouseLeave: onHoverEnd,
      ...props
    });
  };
}

// Create motion components for common HTML elements
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  button: createMotionComponent('button'),
  li: createMotionComponent('li'),
  ul: createMotionComponent('ul'),
} as HTMLMotionComponents;