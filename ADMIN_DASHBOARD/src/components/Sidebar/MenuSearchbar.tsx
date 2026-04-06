import React from 'react'
import { InputText } from "primereact/inputtext";
import { menuItems } from '@/utils/menuItem';

const MenuSearchbar = ({handleSearchChange , setModuleList}:any) => {
  return (
    <div>
      <div className="card flex flex-column align-items-center gap-3 ">
      <span>
      <i className="pi pi-search " style={{position:"relative",left:"25px"}}></i>
      <InputText onChange={(e)=>{
        console.log("e", e.target.value)
        handleSearchChange(e, menuItems, setModuleList)
        }} type="text" className="p-inputtext-sm pl-5 mr-3" placeholder="Search by module name"  />
      </span>

      </div>
    </div>
  )
}

export default MenuSearchbar
