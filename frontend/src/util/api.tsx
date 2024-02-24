import axios, { AxiosResponse } from "axios";

const HOSTNAME = process.env.HOSTNAME
  ? `https://${process.env.HOSTNAME}/api`
  : "http://localhost:3500";

export async function post(url: string, data: any) {
  const apiUrl = `${HOSTNAME}/${url}`;
  return await axios.post(apiUrl, data);
}

export const vespaUrl = process.env.VESPA_URL || "http://localhost:4545";

export async function get(url: string) {
  const apiUrl = `${HOSTNAME}/${url}`;
  return await axios.get(apiUrl);
}
