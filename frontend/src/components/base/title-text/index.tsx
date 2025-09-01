import { Flex, Text } from "@mantine/core";

export default function TitleText({ children }: { children: string }) {
    return (
        <Text size="xl">
            {children}
        </Text>
    );
}