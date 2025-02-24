import { APIRequestContext, APIResponse } from "@playwright/test";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class APITestContext {
  private response: APIResponse | undefined;
  private authToken: string | undefined;

  constructor(
    private readonly baseURL: string,
    private readonly request: APIRequestContext
  ) {}

  async initialize() {
    console.log("APITestContext initialized");
  }

  private getRequestFunction(method: HttpMethod) {
    const methodsMap: Record<
      HttpMethod,
      (url: string, options?: any) => Promise<APIResponse>
    > = {
      GET: this.request.get.bind(this.request),
      POST: this.request.post.bind(this.request),
      PUT: this.request.put.bind(this.request),
      DELETE: this.request.delete.bind(this.request),
      PATCH: this.request.patch.bind(this.request),
    };
    return methodsMap[method];
  }

  private buildUrlWithParams(
    endpoint: string,
    params?: Record<string, string>
  ): string {
    if (!params) return `${this.baseURL}${endpoint}`;
    const query = new URLSearchParams(params).toString();
    return `${this.baseURL}${endpoint}?${query}`;
  }

  async sendRequest(
    method: HttpMethod,
    endpoint: string,
    options: {
      data?: any;
      params?: Record<string, string>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<APIResponse> {
    const url = this.buildUrlWithParams(endpoint, options.params);
    const ks = this.authToken;
    const requestOptions = {
      data: options.data,
      headers: {
        ...options.headers,
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        "Content-Type": "application/json",
      },
    };

    const requestFn = this.getRequestFunction(method);
    this.response = await requestFn(url, requestOptions);
    return this.response;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }
  getAuthToken(): string {
    return this.authToken || "";
  }

  getResponse(): APIResponse | undefined {
    return this.response;
  }

  async getResponseBody<T>(): Promise<T> {
    if (!this.response)
      throw new Error("No response available. Please send a request first.");
    return await this.response.json();
  }

  getResponseStatus(): number {
    if (!this.response)
      throw new Error("No response available. Please send a request first.");
    return this.response.status();
  }

  async expectSuccessfulResponse() {
    const status = this.getResponseStatus();
    if (status < 200 || status >= 300) {
      const body = this.response
        ? await this.response.text()
        : "No response body";
      throw new Error(`Request failed with status ${status}: ${body}`);
    }
  }
}
