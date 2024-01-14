export class HttpClient {
  static async get<Response>(path: string) {
    const response = await fetch(path);

    const data = await response.json();

    if (!response?.ok) throw new Error(data);

    return data as Response;
  }

  static async put<Response>(path: string, body: Record<string, unknown> = {}) {
    const response = await fetch(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response?.ok) throw new Error(data);

    return data as Response;
  }
}
