import NavTextLink from "@/components/base/nav-text-link"
import { useLatestUtxoDatas } from "@/store/utxo/hooks"
import { numberConverTo } from "@/utils/math-format"
import { Card, Divider, Flex, NumberFormatter, Text, UnstyledButton } from "@mantine/core"
import { IconNotes } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export default function LatestUtxosTable() {
    const latestUtxos = useLatestUtxoDatas()
    const router = useRouter()
    return (
        <Flex direction={"column"} gap={"sm"}>
            <Card withBorder radius={8} p={"6px"} visibleFrom="sm">
                <Flex direction={"column"} justify={"center"} >
                    {
                        latestUtxos && latestUtxos.map((item, index) => {
                            return (<Flex key={index} direction={"column"}>
                                <Flex direction={"row"} align={"center"} h={82} gap={24} p={24}>
                                    <IconNotes size={18} />
                                    <NumberFormatter style={{ fontSize: "14px" }} value={item.id} thousandSeparator/>
                                    <Text style={{ fontSize: "14px" }}>
                                        {item.digest}
                                    </Text>
                                </Flex>
                                {index != latestUtxos.length - 1 && <Divider />}
                            </Flex>
                            )
                        })
                    }
                </Flex>
            </Card>
            <Flex direction={"column"} gap={"sm"} hiddenFrom="sm">
                {
                    latestUtxos && latestUtxos.map((item, index) => {
                        return (<Card key={index} withBorder radius={8}>
                            <Flex direction={"column"} gap={8} >
                                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                                    <Flex direction={"row"} align={"center"} gap={8}>
                                        <IconNotes size={24} />
                                        <Text style={{ fontSize: "18px", color: "#332526" }}>
                                            <NumberFormatter value={item.id} thousandSeparator />
                                        </Text>
                                    </Flex>
                                </Flex>
                                <div style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                }}>
                                    <Text style={{ fontSize: "16px", color: "#332526" }}>
                                        {item.digest}
                                    </Text>
                                </div>
                            </Flex>
                        </Card>)
                    })
                }
            </Flex>
            {
                latestUtxos && latestUtxos.length === 5 &&
                <Flex justify={"center"}>
                    <UnstyledButton component="a"
                        onClick={() => {
                            router.push("/utxos")
                        }}>
                        View all UTXOs
                    </UnstyledButton>
                </Flex>
            }
        </Flex>
    )
}