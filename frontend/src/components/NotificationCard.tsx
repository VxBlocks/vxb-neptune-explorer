import { Notification, Text } from '@mantine/core';
import { useState } from 'react';
export default function NotificationCard() {
    const [show, setShow] = useState(true);
    return (
        <>
            {
                show && <Notification
                    onClose={() => setShow(false)}
                    color="orange" radius="xs" title=
                    {
                        <Text>
                            The hard-fork has officially happened! If there's any miner that have not upgraded to <Text component="a" target="_blank" c="green" inherit href='https://github.com/Neptune-Crypto/neptune-core/releases/tag/v0.2.0' style={{}}>
                                0.2.0
                            </Text>, you're wasting valuable resources. </Text>}> 
                </Notification>
            }</>
    )
}