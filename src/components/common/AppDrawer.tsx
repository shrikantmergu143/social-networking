import React from 'react';
import { Drawer, type DrawerProps } from 'antd';

export interface AppDrawerProps extends DrawerProps {
  children: React.ReactNode;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  children,
  placement = 'right',
  width,
  styles: customStyles,
  ...props
}) => {
  const mergedStyles = {
    ...customStyles,
    ...(width ? { wrapper: { ...(customStyles as any)?.wrapper, width: typeof width === 'number' ? `${width}px` : width } } : {})
  };

  return (
    <Drawer
      placement={placement}
      destroyOnHidden
      styles={mergedStyles}
      {...props}
    >
      {children}
    </Drawer>
  );
};
