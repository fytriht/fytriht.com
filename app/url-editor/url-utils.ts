export interface CustomURL {
  scheme?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  query?: string;
  hash?: string;
}

// TODO: test case
export function fromUrlString(u: string): CustomURL {
  let scheme: string | undefined = undefined;
  let hostname: string | undefined = undefined;
  let port: string | undefined = undefined;
  let pathname: string | undefined = undefined;
  let query: string | undefined = undefined;
  let hash: string | undefined = undefined;
  let url = u;
  if (url.includes("#")) {
    const res = url.split("#");
    url = res[0];
    hash = `#${res[1]}`;
  }
  [url, query] = url.split("?");
  // TODO: match port
  const matched = url.match(/^(\w+?):\/\/(\S+?)(:\d+?)?(\/\S+?)?$/);
  if (matched !== null) {
    [, scheme, hostname, port, pathname] = matched;
    if (port !== undefined) {
      port = port.slice(1);
    }
  }

  return {
    scheme,
    hostname,
    port,
    pathname,
    query,
    hash,
  };
}

export function canParsed(u: string): boolean {
  try {
    const customUrl = fromUrlString(u);
    return customUrl.scheme !== undefined && customUrl.hostname !== undefined;
  } catch {
    return false;
  }
}

export function toUrlString(u: CustomURL): string {
  let str = "";
  str += `${u.scheme}://${u.hostname}`;
  if (u.port) {
    str += `:${u.port}`;
  }
  if (u.pathname) {
    str += u.pathname;
  }
  if (u.query) {
    str += `?${u.query}`;
  }
  if (u.hash) {
    str += u.hash;
  }
  return str;
}
