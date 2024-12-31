/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import logoMin from '../../../shared/images/logo-expense-guardian-min.png';
import Image from "next/image";

interface MainToolbarProps {
    handleDrawerClick: (event: boolean) => any;
    handleAccountMenuClick: (event: MouseEvent<HTMLElement>) => void;
    handleShowMoreMenuClick: (event: MouseEvent<HTMLElement>) => void;
}

const MainToolbar = ({ handleDrawerClick, handleAccountMenuClick, handleShowMoreMenuClick }: MainToolbarProps) => {
    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    return (
        <AppBar position="static" className="mb-2" color='transparent'>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={handleDrawerClick(true)}
            >
                <MenuIcon />
            </IconButton>
            <Image src={logoMin} alt="Logo" className="logo-min pe-2" />
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
            >
                Expense Guardian
            </Typography>
            {/* <Search>
                <SearchIconWrapper>
                <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                />
            </Search> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                {/* <Badge badgeContent={4} color="error"> */}
                    <MailIcon />
                {/* </Badge> */}
                </IconButton>
                <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                >
                {/* <Badge badgeContent={17} color="error"> */}
                    <NotificationsIcon />
                {/* </Badge> */}
                </IconButton>
                <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleAccountMenuClick}
                color="inherit"
                >
                <AccountCircle />
                </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleShowMoreMenuClick}
                color="inherit"
                >
                <MoreIcon />
                </IconButton>
            </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MainToolbar;