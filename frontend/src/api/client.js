//to call endpoints
const API_BASE = env(BACKEND_URL);

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {'Content-type' : 'application/json'},
         ...options,
    });

    const data = await res.json().catch(() => null);

    if(!res.ok){
        const message = data?.error || `Request Failed(${res.status})`;
        throw new Error(message);
    }

    return data;
}

export const api = {
    get: (path) => request(path),
    post: (path, body) =>request(path, { method: 'POST', body: JSON.stringify(body) }),
};