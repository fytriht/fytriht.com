/**
 * It converts Clash's Proxy Providers Config to Surge's Proxy Policy
 */
import { type NextRequest } from "next/server";
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

export async function GET(req: NextRequest, res: Response) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  const excludeKeyword = searchParams.get("exclude");

  if (url === null) {
    return new Response("`url` query is expected", {
      status: 400,
    });
  }

  const proxies: ProxyConf[] = await fetch(url)
    .then((res) => res.text())
    .then((text) => parseYaml(text))
    .then((obj) => obj.proxies);

  const buf = [];
  buf.push("[Proxy]");
  for (const proxy of proxies) {
    if (excludeKeyword !== null && proxy.name.includes(excludeKeyword)) {
      continue;
    }
    buf.push(
      `${proxy.name} = ${proxy.type}, ${proxy.server}, ${proxy.port}, password=${proxy.password},sni=${proxy.sni}`
    );
  }

  return new Response(buf.join("\n"), {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
