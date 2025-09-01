import { setUtxoPage } from "@/store/utxo/utxo-slice";
import { Group, Pagination, Text } from "@mantine/core";

export default function PaginationContent({ total, currentPage, onchange }:
    { total: number, currentPage: number, onchange: (value: number) => void }) {
    const limit = 10;
    const totalPages = Math.ceil(total / limit);
    const message = `Showing ${limit * (currentPage - 1) + 1} – ${Math.min(total, limit * currentPage)} of ${total}`;
    return (<Group justify="flex-end">
        <Text size="sm">{message}</Text>
        <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onchange}
            withPages={false} />
    </Group>)
}