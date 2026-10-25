import * as msgpack from "./vendor/msgpack.min.js";
export function hasProblem(response) {
    return response.headers.get('Content-Type') === 'application/problem+json';
}
export function getAuthenticityToken() {
    if (globalThis._ && _?.authenticityToken) {
        return _.authenticityToken;
    }
    else {
        return document.getElementById('authenticityToken')?.content;
    }
}
export async function getMessagePack(url) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/msgpack',
            'x-authenticity-token': getAuthenticityToken()
        }
    });
    if (hasProblem(response)) {
        let problem = await response.json();
        throw new Problem(problem);
    }
    return await msgpack.decodeAsync(response.body);
}
export async function post(url) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        }
    });
    let newAuthenticityToken = response.headers.get('x-authenticity-token');
    if (newAuthenticityToken) {
        _.authenticityToken = newAuthenticityToken;
    }
    await ensureSuccess(response);
    return response.json();
}
export function trySynchronizeQuotas(response) {
    let xObjectQuota = response.headers.get('x-object-quota');
    if (xObjectQuota) {
        try {
            mymind.objectQuota = JSON.parse(xObjectQuota);
            return true;
        }
        catch (err) {
            console.log(err);
        }
    }
    return false;
}
export async function postJSON(url, obj) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        },
        body: JSON.stringify(obj)
    });
    let newAuthenticityToken = response.headers.get('x-authenticity-token');
    if (newAuthenticityToken) {
        _.authenticityToken = newAuthenticityToken;
    }
    if (response.headers.get('Content-Type')?.startsWith('text/html')) {
        return await response.text();
    }
    const result = await response.json();
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
export async function patchJSON(url, obj) {
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        },
        body: JSON.stringify(obj)
    });
    let result = await response.json();
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
export async function putJSON(url, obj) {
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        },
        body: JSON.stringify(obj)
    });
    let result = await response.json();
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
export async function getHTML(url) {
    let response = await fetch(url, {
        headers: {
            'x-authenticity-token': getAuthenticityToken(),
            'Viewport-Width': (visualViewport?.width ?? window.innerWidth).toString(),
            'Viewport-Height': (visualViewport?.height ?? window.innerHeight).toString(),
            'DPR': devicePixelRatio.toString()
        }
    });
    return await response.text();
}
export async function getJSON(url, abortSignal) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        },
        signal: abortSignal
    });
    let result = await response.json();
    let newAuthenticityToken = response.headers.get('x-authenticity-token');
    if (newAuthenticityToken) {
        _.authenticityToken = newAuthenticityToken;
    }
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
export async function doDelete(url) {
    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        }
    });
    if (hasProblem(response)) {
        let result = await response.json();
        throw new Problem(result);
    }
}
export { doDelete as delete };
export class Problem extends Error {
    model;
    constructor(model) {
        let detail = model.detail ?? 'Problem';
        super(detail);
        this.name = "Problem";
        this.model = model;
    }
    get type() {
        return this.model.type;
    }
    get status() {
        return this.model.status;
    }
}
export async function ensureSuccess(response) {
    if (hasProblem(response)) {
        let result = await response.json();
        throw new Problem(result);
    }
    else if (!response.ok) {
        throw new Error(`request failed. url = ${response.url} status = ${response.status}`);
    }
}
export async function getProse(url) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/prose+json',
            'x-authenticity-token': getAuthenticityToken()
        }
    });
    let result = await response.json();
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
export async function putProse(url, obj) {
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/prose+json',
            'Accept': 'application/json',
            'x-authenticity-token': getAuthenticityToken()
        },
        body: JSON.stringify(obj)
    });
    let result = await response.json();
    if (hasProblem(response)) {
        throw new Problem(result);
    }
    return result;
}
