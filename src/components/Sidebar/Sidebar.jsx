import React, { useState, useEffect } from 'react'
import { Menu, Skeleton } from 'antd';

import './Sidebar.scss';
import { Link, useLocation } from 'react-router-dom';

import { useTranslation, initReactI18next } from "react-i18next"; 


const Sidebar = ({ windowWidth, collapsed, setCollapsed }) => {
    const pathName = useLocation()
    const [selected, setSelected] = useState(pathName.pathname)
    const [opened, setOpened] = useState(false)
    const { t } = useTranslation();
    const [loading, setLoading]  = useState(false)
    useEffect(() =>{
        setSelected(pathName.pathname)
      }, [pathName])
      const sidebarItems = t('sidebar__items', { returnObjects: true } ) || []
 
      console.info(sidebarItems)
      return (  
        <Menu mode="inline" className="sidebar-menu" onClick={() => {
          windowWidth < 1200 ? setCollapsed(!collapsed) : console.log('hello World')
        }}>
          {sidebarItems && sidebarItems !== "sidebar__items" && sidebarItems.map((item, index) => {
              return <>
              {!item.submenu && 
                    <>
                      {item.groupTitle && !collapsed && <>
                        <span key={item.id} className="sidebar__item__group__title">{item.groupTitle}</span>
                      </>}
                        <Menu.Item key={item.id} icon={<i className={`bx ${item.icon}`}></i>} className={`menu-item ${item.path === selected ? 'active' : ''} ${item.groupTitle && !collapsed && 'group__item'}`}>
                        <Link to={item.path}>
                        {item.label && <span>{item.label}</span>}
                        </Link>
                        </Menu.Item>
                      </>
                      
                      } 
                      
                  {item.submenu && 
                  <Menu.SubMenu key={item.id} icon={<i className={`bx ${item.icon}`}></i>} title={item.label} className={`menu-item`}>
                      {item.submenu.map((subitem) => (
                        subitem.role ? subitem.role === localStorage.getItem('role') && (
                          <Menu.Item  key={subitem.id} className={`menu-item ${subitem.path === selected ? 'active' : ''}`}>
                              <Link to={subitem.path}>
                                {subitem.label}
                              </Link>
                          </Menu.Item>

                        ) : <Menu.Item  key={subitem.id} className={`menu-item ${subitem.path === selected ? 'active' : ''}`}>
                        <Link to={subitem.path}>
                          {subitem.label}
                        </Link>
                    </Menu.Item>
                      ))}
                  </Menu.SubMenu>
                  
                  }
            </>
              })}
        </Menu>
      )  

    
}

export default Sidebar
