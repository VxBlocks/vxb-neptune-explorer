import { Flex } from "@mantine/core";
import WalletAdCard from "./wallet-ad-card";
import SearchInputCard from "./search-input-card";
export default function SearchCard() {

    return (<Flex
        direction={"row"}
        gap={16}
        w="100%"
        bg={"#DEFFC6"}
        style={{ borderRadius: "10px", }}
        justify={"space-between"}
        align={"center"}
        p="md"
    >
        <Flex w={"100%"} hiddenFrom="sm">
            <SearchInputCard />
        </Flex>
        <Flex w={"70%"} visibleFrom="sm">
            <SearchInputCard />
        </Flex>
        <Flex
            w={"auto"}
            style={{ justifyContent: "center", alignItems: "center" }} visibleFrom="sm">
            <WalletAdCard />
        </Flex>
    </Flex>)
}