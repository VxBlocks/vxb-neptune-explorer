import { CSSProperties, useState, useEffect } from "react"

interface clockProps {
    timeStamp: number
    style?: CSSProperties | undefined
}

export const TimeClock = (props: clockProps) => {
    const { timeStamp, style } = props
    const [ts, setTS] = useState(0)
    const [value, setValue] = useState("")
 
    function updateTime() {
        setTS((prev) => prev + 1)
    }

    useEffect(() => {
        const currentTS = Math.floor(Date.now() / 1000)
        const ts = currentTS - timeStamp
        setTS(ts)
    }, [timeStamp])

    useEffect(() => { 
        let timer = setInterval(updateTime, 1000) 
        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        let minute = Math.trunc(ts / 60)
        let second = ts % 60
        if (minute <= 0) {
            setValue(`${getSec(second)}`)
        } else {
            setValue(`${getMin(minute)} ${getSec(second)}`)
        }
    }, [ts])

    function getSec(second: number) {
        return `${second} s ago`
    }

    function getMin(minute: number) {
        return `${minute} m`
    }


    return (
        <span style={{ ...style }}>
            {value}
        </span>
    )
}

