/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { DropDownButton } from 'devextreme-react/drop-down-button';

import './CardMenu.scss';

interface CardMenuProps {
  items: any[]; // Replace 'any' with a more specific type if possible
  visible?: boolean;
}

export const CardMenu: React.FC<CardMenuProps> = ({ items, visible = true }) => {
  return (
    <DropDownButton
      className='overflow-menu'
      items={items}
      visible={visible}
      icon='overflow'
      stylingMode='text'
      showArrowIcon={false}
      dropDownOptions={{ width: 'auto' }}
    />
  );
};