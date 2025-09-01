
export function stringFormatToDateString(date: string) {
    let timestamp = stringConvertToTimestamp(date)
    if (timestamp) {
        
    }
}

/**
 *
 * @param time 2023-10-23 格式 返回秒的时间戳
 */
export function stringConvertToTimestamp(time: string) {
    try {
        const date = new Date(time);
        return Math.floor(date.getTime()/1000);
    } catch (e) {
        return 0
    }
} 