'use client'

import Empty from "@/components/empty";
import { useEffect } from "react";

export default function Tokens() {
      useEffect(() => {
        document.title = `Tokens - Neptune Explorer`;
      }, [])
    return (<> 
        <Empty/>
    </>)
}