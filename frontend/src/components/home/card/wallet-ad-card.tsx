import { Button, Card, Flex, Image, Text } from "@mantine/core";
import { IconArrowRight, IconWallet } from "@tabler/icons-react";

export default function WalletAdCard() { 
    return (<Card radius={15} style={{ backgroundColor: "#fafbff"}}>
        <Flex direction={"row"} justify={"space-between"} align={"center"} >
            <Image
                w={"100%"}
                h={100}
                style={{userSelect: "none" }}
                radius={"md"} 
                src="/logo.png"
            />
            <Flex direction={"column"} gap={10}>
                <Text style={{ textAlign: "right", color: "#0384d8", userSelect: "none" }} fw={600} fz={16}>The Neptune Wallet is ready to go!</Text>
                <Text style={{ textAlign: "right", color: "#0384d8", userSelect: "none" }} fz={10}>One-Step Transfers with Neptune Wallet ⚡</Text>
                <Flex direction={"row"} align={"center"} justify={"end"} gap={8}>
                    {/* <Image
                        w={"100%"}
                        h={32}
                        radius={"md"}
                        style={{ cursor: "pointer" }}
                        src="/icon.png"
                    /> */}
                    <Button
                        variant="default"
                        size="xs"
                        style={{
                            userSelect: "none",
                            backgroundColor: "transparent",
                            color: "#0384d8",
                            borderColor: "#0384d8"
                        }}
                        href="https://github.com/VxBlocks/vxb_neptune_wallet"
                        target="_blank"
                        component="a"
                        leftSection={<IconWallet size={14} />}
                        rightSection={<IconArrowRight size={14} />}
                    >
                        Try Now
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    </Card>)
}