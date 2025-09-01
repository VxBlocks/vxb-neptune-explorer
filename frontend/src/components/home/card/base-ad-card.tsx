import { Card, Flex, Button, Image, Text } from "@mantine/core"
import { IconWallet, IconArrowRight } from "@tabler/icons-react"

export default function BaseAdCard() {
    return (<Card radius={15} style={{ backgroundColor: "#fafbff" }}>
        <Flex direction={"row"} justify={"space-between"} align={"center"} >
            <Image
                w={"100%"}
                h={100}
                style={{ userSelect: "none" }}
                radius={"md"}
                src="/logo.png"
            />
            <Flex direction={"column"} gap={10}> 
                <Text style={{ textAlign: "right", color: "#0384d8", userSelect: "none" }} fw={600} fz={16}>Homepage Header AD</Text> 
                <Text style={{ textAlign: "right", color: "#0384d8", userSelect: "none" }} fz={10}>🔥 Prime Visibility: Your Brand on Our Header!</Text>
                <Flex direction={"row"} align={"center"} justify={"end"} gap={8}> 
                    <Button
                        variant="default"
                        size="xs"
                        style={{
                            userSelect: "none",
                            backgroundColor: "transparent",
                            color: "#0384d8",
                            borderColor: "#0384d8"
                        }}
                        href="https://github.com/VxBlocks/vxb_neptune_wallet/releases"
                        target="_blank"
                        component="a"
                        leftSection={<IconWallet size={14} />}
                        rightSection={<IconArrowRight size={14} />}
                    >
                        Contact Us
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    </Card>)
}