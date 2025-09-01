'use client'
import { UnstyledButton, Group, Box } from "@mantine/core";
import classes from './index.module.css';
import { useRouter } from "next/navigation";
interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    href: string;
    active: string;
    closeDrawer: () => void;
    changeActive: (active: string) => void;
}
export default function MobileLinksGroup({ icon: Icon, label, href, active, closeDrawer: closeDrawer, changeActive: changeActive }: LinksGroupProps) {
    const router = useRouter();
    function onClickLink() {
        if (href) {
            closeDrawer()
            changeActive(href)
            router.push(href)
        }
    }
    return (<UnstyledButton onClick={onClickLink} className={classes.control} data-active={href === active || undefined}>
        <Group justify="space-between" gap={0}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Icon size={24} />
                <Box ml="md">{label}</Box>
            </Box>
        </Group>
    </UnstyledButton>)
}