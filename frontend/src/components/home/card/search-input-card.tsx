import TitleText from "@/components/base/title-text";
import { Flex, Popover, TextInput, CloseButton, Skeleton, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import CallbackBlockView from "./callback-block-view";
import CallbackInoputView from "./callback-input-view";
import CallbackOutputView from "./callback-output-view";
import CallbackTransactionView from "./callback-transaction-view";
import { querySearchApi } from "@/utils/api/apis";
import { useState, useRef, useCallback } from "react";
import { SearchBlockResponse, SearchTransactionResponse, SearchPutDataResponse } from "@/utils/api/types";

interface SearchCallbackData {
    type: string,
    blockData?: SearchBlockResponse,
    transactionData?: SearchTransactionResponse
    inputData?: SearchPutDataResponse
    outputData?: SearchPutDataResponse
}

export default function SearchInputCard() {
    const [value, setQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [showPover, setShowPoper] = useState(false)
    const [result, setResult] = useState({} as SearchCallbackData) 
    async function handleSearch(searchValue: string) {
        setLoading(true)
        try {
            let req = await querySearchApi({ searchValue })
            if (req && req.data && req.data.block) {
                setResult({
                    type: "block",
                    blockData: req.data.block,
                })
            } else if (req && req.data && req.data.transaction) {
                setResult({
                    type: "transaction",
                    transactionData: req.data.transaction,
                })
            } else if (req && req.data && req.data.input) {
                setResult({
                    type: "Input",
                    inputData: req.data.input,
                })
            } else if (req && req.data && req.data.output) {
                setResult({
                    type: "Output",
                    outputData: req.data.output,
                })
            } else {
                setResult({
                    type: "unknown",
                })
            }
        } catch (error: any) {
            setResult({
                type: "unknown",
            })
        }
        setLoading(false)
    }
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); 
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setShowPoper(true)
        setQuery(value); 
        if (timeoutRef.current) clearTimeout(timeoutRef.current); 
        timeoutRef.current = setTimeout(() => {
            if (value.trim()) handleSearch(value.trim());
        }, 500);
    }, [handleSearch]);
 
    const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (value.trim()) {
                setShowPoper(true)
                handleSearch(value.trim());
            }
        }
    }, [handleSearch, value]);
    return (<Flex direction={"column"} gap="lg" w={"100%"}>
        <TitleText>
            Neptune Explorer
        </TitleText>
        <Popover width="target" position="bottom" withArrow shadow="md" opened={showPover} onDismiss={() => setShowPoper(false)} >
            <Popover.Target>
                <TextInput
                    size="md"
                    value={value}
                    placeholder="Search by block / block hash / txn hash ..."
                    leftSection={<IconSearch size={16} />}
                    onChange={handleInputChange}
                    onKeyUp={handleKeyPress}
                    rightSection={
                        <CloseButton
                            onClick={() => setQuery('')}
                            style={{ cursor: "pointer", display: value ? undefined : 'none' }}
                        />}
                />
            </Popover.Target>
            <Popover.Dropdown>
                {
                    loading ? <Flex direction={"column"}>
                        <Skeleton visible={loading} height={8} radius="xl" />
                        <Skeleton visible={loading} height={8} mt={6} radius="xl" />
                        <Skeleton visible={loading} height={8} mt={6} radius="xl" />
                    </Flex> : result.type === "block" && result.blockData ?
                        <CallbackBlockView blockResponse={result.blockData} /> :
                        result.type === "transaction" && result.transactionData ?
                            <CallbackTransactionView transactionResponse={result.transactionData} /> :
                            result.type === "Input" && result.inputData ?
                                <CallbackInoputView inputResponse={result.inputData} /> :
                                result.type === "Output" && result.outputData ?
                                    <CallbackOutputView outputResponse={result.outputData} />
                                    :
                                    <Flex direction={"column"} gap={8}>
                                        <Text style={{ color: "#718096" }}>
                                            Blocks
                                        </Text>
                                        <Text>
                                            No results found.
                                        </Text>
                                    </Flex>

                }

            </Popover.Dropdown>
        </Popover>
    </Flex>)
}