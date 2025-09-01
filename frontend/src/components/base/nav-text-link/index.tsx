import Link from "next/link";
import styles from "./link.module.css";
import { CSSProperties } from "react";

export default function NavTextLink({ children, href, disable, style }: { children: React.ReactNode, href: string, disable?: boolean, style?: CSSProperties | undefined }) {
    return (
        <Link className={disable ? styles.unlink : styles.link} style={{ ...style }} href={href}>
            {children}
        </Link>
    );
}