import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, HoverCard, Text, UnstyledButton } from '@mantine/core';
import classes from './index.module.css';
import { useRouter } from 'next/navigation';

interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    href?: string;
    active: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string, icon?: React.FC<any> }[];
    changeActive: (active: string) => void;
}

export function LinksGroup({ icon: Icon, label, href, initiallyOpened, links, active, changeActive: changeActive }: LinksGroupProps) {
    const hasLinks = Array.isArray(links) && links.length > 0;
    const [opened, setOpened] = useState(initiallyOpened || false);
    const router = useRouter();
    const items = (hasLinks ? links : []).map((link) => (
        <Text<'a'>
            component="a"
            className={classes.link}
            href={link.link}
            key={link.label}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </Text>
    ));

    function onClickLink() {
        if (hasLinks) {
            changeActive("")
            setOpened((o) => !o)
        } else if (href) {
            changeActive(href)
            router.push(href)
        }
    }
    return (
        <>
            {
                hasLinks ?
                    <HoverCard width={190} shadow="md" position={"right-start"}>
                        <HoverCard.Target>
                            <UnstyledButton className={classes.control} data-active={href === active || undefined}>
                                <Group justify="space-between" gap={0}>
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon size={24} />
                                        <Box ml="md">{label}</Box>
                                    </Box>
                                    <IconChevronRight
                                        className={classes.chevron}
                                        stroke={1.5}
                                        size={16}
                                        style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                                    />
                                </Group>
                            </UnstyledButton>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            {
                                links.map((item, index) => {
                                    return (<UnstyledButton
                                        key={index}
                                        onClick={() => {
                                            router.push(item.link)
                                        }} className={classes.linkscontrol} data-active={item.link === active || undefined}>
                                        <Group justify="space-between" gap={0}>
                                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                {item.icon && <item.icon size={24} />}
                                                <Box ml="md">{item.label}</Box>
                                            </Box>
                                        </Group>
                                    </UnstyledButton>)
                                })
                            }
                        </HoverCard.Dropdown>
                    </HoverCard>
                    :
                    <UnstyledButton onClick={onClickLink} className={classes.control} data-active={href === active || undefined}>
                        <Group justify="space-between" gap={0}>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon size={24} />
                                <Box ml="md">{label}</Box>
                            </Box>
                            {hasLinks && (
                                <IconChevronRight
                                    className={classes.chevron}
                                    stroke={1.5}
                                    size={16}
                                    style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                                />
                            )}
                        </Group>
                    </UnstyledButton>
            }
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
} 