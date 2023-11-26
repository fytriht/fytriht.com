/**
 * It converts Clash's Proxy Providers Config to Surge's Proxy Policy
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { parse as parseYaml } from "yaml";

// Example: { name: 'name', type: 'trojan', server: 'test.com', port: 10051, password: '1111111', udp: true, 'skip-cert-verify': false, sni: 'apis.1111.test' }
export interface ProxyConf {
  name: string;
  type: string;
  server: string;
  port: number;
  password: string;
  udp: boolean;
  "skip-cert-verify": boolean;
  sni: string;
}

export interface Query {
  url: string;
  exclude?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, exclude: excludeKeyword } = req.query as unknown as Query;

  const proxies: ProxyConf[] = await fetch(url)
    .then((res) => res.text())
    .then((text) => parseYaml(text))
    .then((obj) => obj.proxies);

  const buf = [];
  buf.push("[Proxy]");
  for (const proxy of proxies) {
    if (excludeKeyword !== undefined && proxy.name.includes(excludeKeyword)) {
      continue;
    }
    buf.push(
      `${proxy.name} = ${proxy.type}, ${proxy.server}, ${proxy.port}, password=${proxy.password},sni=${proxy.sni}`
    );
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(buf.join("\n"));
}
