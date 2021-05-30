import { Client, PrivateKey } from "@textile/hub";

export const getIdentity = async () => {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem("user-private-identity");
  if (cached !== null) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(cached);
  }
  /** No cached identity existed, so create a new one */
  const identity = await PrivateKey.fromRandom();
  /** Add the string copy to the cache */
  localStorage.setItem("user-private-identity", identity.toString());
  /** Return the random identity */
  return identity;
};

export async function authorize(key, identity) {
  const client = await Client.withKeyInfo(key);
  await client.getToken(identity);
  return client;
}

export async function list(client) {
  const threads = await client.listThreads();
  return threads;
}

export async function createDB(client) {
  const thread = await client.newDB();
  return thread;
}

// const user = await getIdentity();
// const client = await authorize(keyInfo, user);
