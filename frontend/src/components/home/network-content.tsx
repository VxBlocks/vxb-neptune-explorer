import { Flex, Text } from "@mantine/core";

export default function NetworkContent() {
    return (<Flex
        w={"100%"}
        direction={"row"}
        justify={"end"}>
        <Flex
            style={{
                border: "1px solid #009291",
                borderRadius: "8px",
                padding: "2px 8px"
            }}
            align={"center"}>
            <Text c={"#009291"} style={{ fontSize: "10px" }}>
                Network: Main
            </Text>
        </Flex>

    </Flex>)
}