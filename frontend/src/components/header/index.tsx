import { Burger, Drawer, Flex, Group, Image } from '@mantine/core';
import NetworkContent from '../home/network-content';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import MobileNavbar from '../navbar/mobileNavbar';
import HyperliquidContent from '../home/hyperliquid-content';

export function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const router = useRouter();
    return (
        <Group w={"100%"}>
            <Group justify="space-between" w={"100%"} px={30} wrap="nowrap" style={{ margin: "10px 0" }}>
                <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                <Flex direction={"row"} gap={16}>
                    <HyperliquidContent />
                    <NetworkContent />
                </Flex>
            </Group>
            <Drawer
                styles={{
                    header: {
                        backgroundColor: "#332526"
                    },
                    content: {
                        backgroundColor: "#332526"
                    },
                    close: {
                        color: "#fff",
                        backgroundColor: "#332526"
                    }
                }}
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                title={<Image
                    style={{ cursor: "pointer" }}
                    src={"/icon-neptune.png"}
                    h={24}
                    onClick={() => {
                        router.push("/")
                        closeDrawer()
                    }
                    }
                />}
                hiddenFrom="sm"
            >
                <MobileNavbar closeDrawer={closeDrawer} />
            </Drawer>
        </Group>
    );

}