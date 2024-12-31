/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AccountMenu from "./account-menu/account-menu";
import MainDrawer from "./main-drawer/main-drawer";
import MainToolbar from "./main-toolbar/main-toolbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  return (
    <div>
      <MainDrawer open={openDrawer} handleClose={toggleDrawer} />
      {(children?.type.name && children?.type.name != 'Login') && 
        <MainToolbar handleDrawerClick={toggleDrawer} handleAccountMenuClick={handleProfileMenuOpen} handleShowMoreMenuClick={handleMobileMenuOpen} />
      }
      <AccountMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
      {children}
    </div>
  );
}
