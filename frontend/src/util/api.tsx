import axios, { AxiosResponse } from "axios";

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = 3500;

// Function to make a POST request with configurable hostname
export async function post(url: string, data: any) {
  const apiUrl = `http://${HOSTNAME}:${PORT}/${url}`;
  return await axios.post(apiUrl, data);
}

export const vespaUrl = process.env.VESPA_URL || "http://localhost:4545";

// Function to make a GET request with configurable hostname
export async function get(url: string) {
  const apiUrl = `http://${HOSTNAME}:${PORT}/${url}`;
  return await axios.get(apiUrl);
}
