import React, { ReactNode } from 'react';
import useScreenSize from '../hooks/useScreenSize';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
interface ResponsiveComponentProps {
  children: (props: { size: ScreenSize }) => ReactNode;
}

const ResponsiveComponent: React.FC<ResponsiveComponentProps> = ({ children }) => {
  const size = useScreenSize();

  return <>{children({ size })}</>;
};

export default ResponsiveComponent;
export {};