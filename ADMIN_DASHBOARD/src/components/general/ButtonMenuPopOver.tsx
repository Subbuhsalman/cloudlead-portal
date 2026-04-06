import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

import React from "react";

type ButtonMenuPopOverTypesProps = {
  items: Array<any>;
  icon: string;
  tableSettings?: any | null;
};
const ButtonMenuPopOver = (props: ButtonMenuPopOverTypesProps) => {
  const { items = [],
    icon = "pi pi-ellipsis-v",
    tableSettings = {}, } = props;

  const menuLeft = useRef<any>(null);
    console.log("items",items);
  return (
    <>
      <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button text
        icon={icon}
        size="small"
        className={'mr-2 p-button-secondary' + ((tableSettings?.showHoverButtons === true) ? ' table-action-buttons' : '')}
        onClick={(event: any) => menuLeft.current.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
        tooltip="More options"
        tooltipOptions={{ position: 'left' }}

      />
    </>
  );
};

export { ButtonMenuPopOver };
