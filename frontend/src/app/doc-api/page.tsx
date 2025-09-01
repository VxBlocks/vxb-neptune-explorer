'use client'
import { Container } from "@mantine/core";
import "./swagger.css"
import { SWAGGER_URL } from "@/config";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(
    () => import('swagger-ui-react'),
    {
        ssr: false, 
        loading: () => <p>Loading Swagger...</p>
    }
);


export default function Api() {
    useEffect(() => {
        document.title = `Apis - Neptune Explorer`;
    }, [])
    return (<Container fluid p={"lg"}>
        <SwaggerUI url={SWAGGER_URL} />
    </Container>)
}