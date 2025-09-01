'use client'
import { mobileLinkdata } from "@/config/router";
import { ScrollArea } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import classes from './navbar.module.css';
import MobileLinksGroup from "../base/navbar-links-group/mobileLinksGroup";

export default function MobileNavbar({ closeDrawer }: { closeDrawer: () => void }) {
    const pathName = usePathname();
    const path = usePathname()
    const [active, setActive] = useState('/');
    const links = mobileLinkdata.map((item) => <MobileLinksGroup
        active={active}
        closeDrawer={closeDrawer}
        changeActive={function (active: string): void {
            setActive(active)
        }} {...item} key={item.label} />);
    useEffect(() => {
        if (path) {
            setActive(path)
        }
    }, [path])

    return (<ScrollArea className={classes.links}>
        <div className={classes.mobildLinksInner}>{links}</div>
    </ScrollArea>)
}