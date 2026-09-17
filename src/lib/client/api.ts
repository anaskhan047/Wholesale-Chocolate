type ApiOk<T> = {
  ok: true;
  message: string;
  data: T;
};

type ApiFail = {
  ok: false;
  message: string;
};

async function readApi<T>(response: Response) {
  const payload = (await response.json()) as ApiOk<T> | ApiFail;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.ok ? "Request failed" : payload.message);
  }

  return payload;
}

export async function getJson<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  return readApi<T>(response);
}

export async function getData<T>(url: string) {
  const payload = await getJson<T>(url);
  return payload.data;
}

export async function postJson<T>(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return readApi<T>(response);
}

export async function postForm<T>(url: string, body: FormData) {
  const response = await fetch(url, {
    method: "POST",
    body,
  });

  return readApi<T>(response);
}

export async function patchForm<T>(url: string, body: FormData) {
  const response = await fetch(url, {
    method: "PATCH",
    body,
  });

  return readApi<T>(response);
}

export async function deleteJson<T>(url: string) {
  const response = await fetch(url, { method: "DELETE" });
  return readApi<T>(response);
}
