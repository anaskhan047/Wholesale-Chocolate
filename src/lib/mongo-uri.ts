import { Resolver } from "dns/promises";

function parseMongoUri(uri: string) {
  const url = new URL(uri);
  return {
    protocol: url.protocol,
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    hostname: url.hostname,
  };
}

export async function getConnectUri(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  try {
    const { username, password, hostname } = parseMongoUri(uri);
    const resolver = new Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);

    const [records, txtRecords] = await Promise.all([
      resolver.resolveSrv(`_mongodb._tcp.${hostname}`),
      resolver.resolveTxt(hostname),
    ]);

    const hosts = records.map((record) => `${record.name}:${record.port}`).join(",");
    const txt = txtRecords.flat().join("&");
    const user = encodeURIComponent(username);
    const pass = encodeURIComponent(password);

    return `mongodb://${user}:${pass}@${hosts}/?${txt}&tls=true&retryWrites=true&w=majority`;
  } catch (error) {
    console.error("Mongo SRV fallback failed:", error);
    return uri;
  }
}
