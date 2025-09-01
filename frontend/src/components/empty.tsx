import { Alert, Center, Flex } from "@mantine/core";

export default function Empty({ w, h }: { w?: string, h?: string }) {
    return (
        <Center w={w ?? "100%"} h={h ?? "100vh"}>
            <Alert title="Magic is in the making... ✨" withCloseButton={false}>
                Stay tuned for awesome updates!
            </Alert>
        </Center>
    )
}