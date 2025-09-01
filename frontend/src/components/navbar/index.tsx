
'use client'

import { ScrollArea, Image, Space, Box, Group } from '@mantine/core';
import classes from './navbar.module.css';
import { LinksGroup } from '../base/navbar-links-group';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { linkdata } from '@/config/router'; 
function Navbar() { 
    const path = usePathname()
    const [active, setActive] = useState('/');
    const links = linkdata.map((item) => <LinksGroup active={active} changeActive={function (active: string): void {
        setActive(active)
    }} {...item} key={item.label} />);
    const router = useRouter();
    useEffect(() => {
        if (path) {
            setActive(path)
        }
    }, [path]) 
    return (<Box> 
        <Group visibleFrom='sm'>
        <nav className={classes.navbar} >
            <Space h={64} />
            <Image
                style={{ cursor: "pointer" }}
                radius="md"
                src={"/icon-neptune.png"}
                h={24}
                onClick={() => {
                    router.push("/")
                }}
            />
            <Space h={16} />
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>
            <div className={classes.footer}> 
            </div>
        </nav>
        </Group> 
    </Box>)
}

export default React.memo(Navbar);