import { WS_URL } from "@/config";

type WSListeners = (ev: MessageEvent) => any
const heartBeatTime = 30000 
const maxReconnectTimes = 15;

class WSClient {
    wsClient = new WebSocket(WS_URL)
    listeners: Map<string, WSListeners> = new Map<string, WSListeners>()
    intervalId?: NodeJS.Timer
    timeoutObj?: number

    reconnectTime = 0

    constructor() { 
    }

    public addEventListener(key: string, value: WSListeners) {
        if (this.wsClient.CLOSED) {
            this.createWebSocket();
        }
        this.listeners.set(key, value)
    }

    public removeEventListener(key: string) {
        this.listeners.delete(key)
    }

    handleMessage(ev: MessageEvent) {
        for (const listener of this.listeners.values()) {
            listener(ev)
        }
    }

    heartCheck = {

        reset: () => { 
            clearTimeout(this.timeoutObj)
            return this.heartCheck;
        },
        start: () => { 
            // @ts-ignore
            this.timeoutObj = setTimeout(() => {
                this.wsClient.close();
            }, heartBeatTime)
        }
    }
    initEventHandle() {
        this.wsClient.addEventListener("open", () => {
            this.reconnectTime = 0
            this.wsClient.send(JSON.stringify({
                action: "subscribe",
                topic: "blocks",
            }))
            this.heartCheck.reset().start();
        })

        this.wsClient.addEventListener("close", () => {
            this.reconnect();
        })

        this.wsClient.addEventListener("error", () => {
            this.reconnect();
        })

        this.wsClient.addEventListener("message", (e) => {
            this.heartCheck.reset().start();
            this.handleMessage(e)
        })
    }
    createWebSocket() {
        try {
            this.wsClient = new WebSocket(WS_URL);
            this.initEventHandle();
        } catch (e) {
            this.reconnect();
        }
    }

    closeWebSocket() {
        try {
            this.wsClient.close()
        } catch (e) {

        }

    }
    reconnect() {
        this.reconnectTime++
        if (this.reconnectTime <= maxReconnectTimes) {
            setTimeout(() => {
                this.createWebSocket();
            }, 3000 * this.reconnectTime);
        }
    }
}


const wsClient = new WSClient();

export default wsClient;