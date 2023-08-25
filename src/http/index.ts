interface RequestHeaders {
  // token: string;
  // 'Content-Type': 'application/json';
  [key: string]: any;
}

interface RequestArgs {
  headers?: RequestHeaders;
  body?: Record<string, unknown>;
}

interface ApiResponse {
  code: number;
  result?: unknown;
  error?: string;
  msg?: string;
}

const http = {
  async request(
    path: string,
    data?: Record<string, unknown>,
    args: RequestArgs = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<ApiResponse | null> {
    const url = path.includes('://') ? path : `/api${path}`;
    try {
      const headers: RequestHeaders = new Headers();
      headers['Content-Type'] = 'application/json';
      const options = {
        headers,
        method,
        ...args,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
      };

      if (method === 'GET' && data) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) =>
          params.append(key, `${value}`)
        );
        options.body = params.toString();
      }

      const ret = await fetch(url, options);
      const json: ApiResponse = await ret.json();

      if (json.code === 200) {
        return json as ApiResponse;
      }

      if (json.code === 401) {
        alert(json.result);
        location.replace('/');
      } else if (json.code === 403) {
        alert(json.result);
      } else {
        alert(json.error || json.msg);
      }

      return null;
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    return null;
  },

  get(path: string, data?: Record<string, unknown>, args?: RequestArgs) {
    return this.request(path, data, args, 'GET');
  },

  post(path: string, data?: Record<string, unknown>, args?: RequestArgs) {
    return this.request(path, data, args, 'POST');
  },

  put(path: string, data?: Record<string, unknown>, args?: RequestArgs) {
    return this.request(path, data, args, 'PUT');
  },

  delete(path: string, data?: Record<string, unknown>, args?: RequestArgs) {
    return this.request(path, data, args, 'DELETE');
  },
};


export default http;