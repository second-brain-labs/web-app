import axios, { AxiosResponse } from "axios";

const HOSTNAME = process.env.REACT_APP_HOSTNAME
  ? `https://${process.env.REACT_APP_HOSTNAME}/api`
  : "http://localhost:3500";

export async function post(url: string, data: any) {
  const apiUrl = `${HOSTNAME}/${url}`;
  return await axios.post(apiUrl, data);
}

export const vespaUrl =
  process.env.REACT_APP_VESPA_URL || "https://secondbrainlabs.xyz/vespa";

export async function get(url: string) {
  const apiUrl = `${HOSTNAME}/${url}`;
  return await axios.get(apiUrl);
}

export async function deleteCall(url: string) {
  const apiUrl = `${HOSTNAME}/${url}`;
  return await axios.delete(apiUrl);
}
