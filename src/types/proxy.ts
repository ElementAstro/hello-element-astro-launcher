export interface ProxyLog {
  time: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface Proxy {
  id: string;
  name: string;
  description: string;
  status: "running" | "idle" | "error";
  type: "http" | "socks5";
  address: string;
  latency: number;
  logs: ProxyLog[];
}
