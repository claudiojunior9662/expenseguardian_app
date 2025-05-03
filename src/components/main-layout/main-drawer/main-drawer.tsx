/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useRouter } from "next/navigation";

interface MainDrawerProps {
    open: boolean;
    handleClose: (event: boolean) => any;
}

const MainDrawer = ({ open, handleClose }: MainDrawerProps) => {
    const router = useRouter();

    function handleRoute(route: string) {
        router.push(route);
    }

    const drawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={handleClose(false)}>
            <List>
                <ListItem key={'Home'} disablePadding>
                    <ListItemButton onClick={() => handleRoute('/')}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider>Categories</Divider>
            <List>
                <ListItem key={'Budget Categories'} disablePadding>
                    <ListItemButton onClick={() => handleRoute('/budget/categories')}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Budget Categories'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'Investment Categories'} disablePadding>
                    <ListItemButton onClick={() => handleRoute('/investment/categories')}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Investment Categories'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider>Budgets</Divider>
            <List>
                <ListItem key={'Registrations'} disablePadding>
                    <ListItemButton onClick={() => handleRoute('/budget')}>
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Registrations'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider>Bank</Divider>
            <List>
                <ListItem key={'Accounts'} disablePadding>
                    <ListItemButton onClick={() => handleRoute('/bank/account')}>
                        <ListItemIcon>
                            <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Accounts'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Drawer open={open} onClose={handleClose(false)}>
            {drawerList}
        </Drawer>
    );
};

export default MainDrawer;