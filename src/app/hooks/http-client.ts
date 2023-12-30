export class HttpClient {
  static async get<Response>(path: string) {
    const response = await fetch(path);

    const data = await response.json();

    if (!response?.ok) throw new Error(data);

    return data as Response;
  }
}
