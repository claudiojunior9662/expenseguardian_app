import { Typography, Breadcrumbs } from "@mui/material";
import Link from "next/link";

interface MainBreadcumbsChildrenLinks {
    link: string;
    name: string;
}

interface MainBreadcumbsProps {
    childrenLinks?: MainBreadcumbsChildrenLinks[];
    openedLink: string;
}

const MainBreadcumbs = ({ childrenLinks, openedLink }: MainBreadcumbsProps) => {

    return (
        <Breadcrumbs aria-label="breadcrumb"  className="pb-3 pt-2">
            <Link color="inherit" href="/">
                Home
            </Link>
            {(childrenLinks && childrenLinks.length > 1) && 
                childrenLinks.map((link, index) => (
                    <Link key={index} color="inherit" href={link.link}>
                        {link.name}
                    </Link>
                ))
            }
            <Typography sx={{ color: 'text.primary' }}>{openedLink}</Typography>
        </Breadcrumbs>
    );
};

export default MainBreadcumbs;