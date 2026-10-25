function isMasqueradingIpad() {
    return !(navigator.userAgent.includes('iPad')) && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
}
export const isIOS = navigator.userAgent.match(/(iPhone|iPad)/);
export const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
export const isIPad = navigator.userAgent.includes('iPad') || isMasqueradingIpad();
export let Easings = {
    easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
    easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)'
};
export function caseInsensitiveEqual(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
}
;
export function disableDragging(element) {
    if (!element)
        return;
    element.draggable = false;
}
export function fit(element, box) {
    if (element.height <= box.height && element.width <= box.width) {
        return { width: element.width, height: element.height };
    }
    let multiplier = (box.width / element.width);
    if (element.height * multiplier <= box.height) {
        return {
            width: box.width,
            height: Math.round(element.height * multiplier)
        };
    }
    else {
        multiplier = (box.height / element.height);
        return {
            width: Math.round(element.width * multiplier),
            height: box.height
        };
    }
}
export function hasActiveInput() {
    const activeEl = document.activeElement;
    if (!activeEl)
        return false;
    return activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.hasAttribute('contenteditable');
}
export function toPascalCase(text) {
    return text
        .toLowerCase()
        .split('-')
        .map(it => it.charAt(0).toUpperCase() + it.substring(1))
        .join('');
}
export function toCamelCase(text) {
    return text
        .split('-')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        const context = this;
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}
export function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
}
;
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function isOverflowing(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
export async function writeToClipboard(text) {
    if (mymind.native?.isAndroid) {
        mymind.native.writeToClipboard(text);
    }
    else {
        await navigator.clipboard.writeText(text);
    }
}
export function commaCommittedValue(value) {
    if (value.at(-1) !== ',')
        return null;
    return value.slice(0, -1).trim();
}
export function removeFromArray(array, pred) {
    let changed = false;
    let j = 0;
    for (const elt of array) {
        if (pred(elt)) {
            changed = true;
        }
        else {
            array[j++] = elt;
        }
    }
    array.length = j;
    return changed;
}
export function removeArrayElement(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}
export async function getPartialDOM(url) {
    let html = await getPartialHTML(url);
    return parseElement(html);
}
export async function getDocumentFragment(url) {
    let html = await getPartialHTML(url);
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}
export async function getPartialHTML(url) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'text/html',
            'x-viewport-width': window.screen.width.toString(),
            'x-viewport-height': window.screen.height.toString(),
            'x-partial': '1'
        }
    });
    if (!response.ok) {
        throw new Error(`${url} fetch was not successful. status = ${response.status}`);
    }
    return await response.text();
}
export function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
export function getWords(el) {
    let result = [];
    _getWords(el, result);
    return result;
}
export function getProseWords(prose) {
    let result = [];
    _getProseWords(prose, result);
    return result;
}
const ignoreChars = ['/', '|', '&', '+', '.', '\\', '=', '-', 'ΓåÆ', '#', '>', 'ΓÇô', '{', '}', ',', ':', 'ΓÇö', '?'];
function _getProseWords(prose, words) {
    if (prose.text) { // text
        for (let word of prose.text.split(' ')) {
            word = word.trim();
            if (word.endsWith('.') || word.endsWith('?')) {
                word = word.slice(0, -1);
            }
            if (word.length == 1 && ignoreChars.includes(word)) {
                continue;
            }
            if (word.length > 0) {
                words.push(word);
            }
        }
    }
    if (prose.content) {
        for (const childNode of prose.content) {
            _getProseWords(childNode, words);
        }
    }
}
function _getWords(node, words) {
    if (node.nodeType === 1) { // element
        for (const childNode of node.childNodes) {
            _getWords(childNode, words);
        }
    }
    else if (node.nodeType === 3) { // text
        for (let word of (node.textContent ?? '').split(' ')) {
            word = word.trim();
            if (word.length == 1) {
                if (ignoreChars.includes(word)) {
                    continue;
                }
            }
            if (word.length > 0) {
                words.push(word);
            }
        }
    }
}
export function getRelativeCoordinates(e, refEl) {
    const offset = {
        left: refEl.offsetLeft,
        top: refEl.offsetTop
    };
    let cur = refEl.offsetParent;
    while (cur instanceof HTMLElement) {
        offset.left += cur.offsetLeft;
        offset.top += cur.offsetTop;
        cur = cur.offsetParent;
    }
    return {
        x: e.pageX - offset.left,
        y: e.pageY - offset.top,
    };
}
export function loadMedia(el) {
    let { src, srcset } = el.dataset;
    if (!src && !srcset) {
        throw new Error('[Lazy] Missing data-src');
    }
    if (!el.classList.contains('lazy')) {
        return;
    }
    if (el instanceof HTMLImageElement) {
        let img = el;
        img.onload = () => {
            el.classList.remove('loading');
            el.classList.add('loaded');
        };
        if (src) {
            img.src = src;
        }
        else if (srcset) {
            img.srcset = srcset;
        }
    }
    else if (el instanceof HTMLVideoElement && src) {
        el.draggable = false;
        el.playsInline = true;
        el.muted = true;
        el.src = src;
    }
    el.draggable = false;
    el.classList.remove('lazy');
}
export class Callback {
    id;
    timeoutId;
    resolved = false;
    promise;
    #signal;
    _resolve;
    _reject;
    static sequenceNumber = 0;
    static instances = new Map();
    #onAbortListener = this.onAbort.bind(this);
    constructor(options) {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        if (options?.signal) {
            this.#signal = options.signal;
            this.#signal.addEventListener("abort", this.#onAbortListener, { once: true });
        }
        if (options?.timeout) {
            this.timeoutId = setTimeout(this.cancel.bind(this), options.timeout);
        }
    }
    onAbort() {
        if (this.resolved)
            return;
        let reason = this.#signal?.reason ?? new Error("Timed out");
        this.reject(reason);
    }
    cancel() {
        if (this.resolved) {
            return;
        }
        this.reject(new Error('Cancelled'));
    }
    resolve(value) {
        if (this.resolved)
            return;
        if (this.#signal?.aborted) {
            this._reject(new Error('Aborted'));
            return;
        }
        this.resolved = true;
        this._resolve(value);
        this.dispose();
    }
    reject(value) {
        if (this.resolved)
            return;
        this.resolved = true;
        this._reject(value);
        this.dispose();
    }
    dispose() {
        this.promise = null;
        if (this.id) {
            Callback.delete(this.id);
        }
        if (this.#signal) {
            this.#signal.removeEventListener("abort", this.#onAbortListener);
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    static nextId() {
        const result = Callback.sequenceNumber++;
        return result.toString();
    }
    static get(id) {
        return Callback.instances.get(id.toString());
    }
    static delete(id) {
        Callback.instances.delete(id);
    }
    static create(options) {
        let callback = new Callback(options);
        callback.id = Callback.nextId();
        Callback.instances.set(callback.id, callback);
        return callback;
    }
}
export class AspectRatio {
    width;
    height;
    value;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.value = height / width;
    }
    static parse(text) {
        let slashIndex = text.indexOf('/');
        return new AspectRatio(parseFloat(text.substring(0, slashIndex)), parseFloat(text.substring(slashIndex + 1)));
    }
}
function isScrollable(node) {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return false;
    }
    let style = getComputedStyle(node);
    return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
        const value = style.getPropertyValue(propertyName);
        return value === 'auto' || value === 'scroll';
    });
}
export function getScrollParent(node) {
    let currentParent = node.parentElement;
    while (currentParent) {
        if (isScrollable(currentParent)) {
            return currentParent;
        }
        currentParent = currentParent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
}
export class Flag {
    value;
    constructor(value = 0) {
        this.value = value;
    }
    get() {
        return this.value;
    }
    set(value) {
        this.value = value;
        return this;
    }
    has(key) {
        return !!(this.value & key);
    }
    add(key) {
        this.value |= key;
        return this;
    }
    delete(key) {
        this.value &= ~key;
        return this;
    }
    toggle(key) {
        this.has(key) ? this.delete(key) : this.add(key);
        return this;
    }
}
export class Stopwatch {
    _start;
    _end;
    constructor() {
        this._start = performance.now();
    }
    restart() {
        this._start = performance.now();
    }
    start() {
        this._start = performance.now();
    }
    stop() {
        this._end = performance.now();
    }
    get elapsed() {
        let end = (this._end ?? performance.now());
        let result = end - this._start;
        return Math.round(result);
    }
}
export function objectBumpedComparer(a, b) {
    if (a.bumped < b.bumped) {
        return 1;
    }
    if (a.bumped > b.bumped) {
        return -1;
    }
    return 0;
}
export function objectScoreComparer(a, b) {
    if (a.score == b.score) {
        if (a.bumped < b.bumped) {
            return 1;
        }
        if (a.bumped > b.bumped) {
            return -1;
        }
        return 0;
    }
    else {
        if (a.score < b.score) {
            return 1;
        }
        if (a.score > b.score) {
            return -1;
        }
        return 0;
    }
}
export function insertAt(array, index, ...items) {
    const i = clamp(index, 0, array.length);
    return [
        ...array.slice(0, i),
        ...items,
        ...array.slice(i)
    ];
}
export function moveItem(array, fromIndex, toIndex) {
    const arr = [...array];
    const len = arr.length;
    const from = clamp(fromIndex, 0, len - 1);
    const to = clamp(toIndex, 0, len - 1);
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    return arr;
}
export function parseElement(html) {
    const range = document.createRange();
    range.selectNode(document.body);
    const frag = range.createContextualFragment(html);
    const el = frag.firstElementChild;
    frag.removeChild(el);
    return el;
}
export function detachNode(node) {
    let parent = node.parentNode;
    if (!parent) {
        return false;
    }
    parent.removeChild(node);
    return true;
}
export class SemanticVersion {
    static default = new SemanticVersion(0, 0, 0);
    major;
    minor;
    patch;
    constructor(major, minor = 0, patch = 0) {
        this.major = major | 0;
        this.minor = minor | 0;
        this.patch = patch | 0;
        if (this.major < 0 || this.minor < 0 || this.patch < 0) {
            throw new Error("Negative version parts are not allowed.");
        }
    }
    static parse(input) {
        if (input instanceof SemanticVersion)
            return input;
        const str = String(input).trim();
        const parts = str.split(".");
        if (parts.length < 1 || parts.length > 3 || parts.some(p => !/^\d+$/.test(p))) {
            throw new Error(`Invalid semantic version: ${str}`);
        }
        const [maj, min = "0", pat = "0"] = parts;
        return new SemanticVersion(Number.parseInt(maj, 10), Number.parseInt(min, 10), Number.parseInt(pat, 10));
    }
    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
    compare(other) {
        const b = SemanticVersion.parse(other);
        if (this.major !== b.major)
            return Math.sign(this.major - b.major);
        if (this.minor !== b.minor)
            return Math.sign(this.minor - b.minor);
        if (this.patch !== b.patch)
            return Math.sign(this.patch - b.patch);
        return 0;
    }
    equals(other) {
        return this.compare(other) === 0;
    }
    atLeast(other) {
        return this.compare(other) >= 0;
    }
}
const Base62 = (() => {
    const RADIX = 62;
    const SYMBOLS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LOOKUP = (() => {
        const table = new Int8Array(128).fill(-1);
        for (let i = 0; i < SYMBOLS.length; i++) {
            table[SYMBOLS.charCodeAt(i)] = i;
        }
        return table;
    })();
    const CHUNK = 8;
    const POWERS = [1n];
    for (let i = 1; i <= CHUNK; i++) {
        POWERS[i] = POWERS[i - 1] * BigInt(RADIX);
    }
    const decodeUInt64 = (text) => {
        const length = text.length;
        let result = 0n;
        for (let i = 0; i < length; i += CHUNK) {
            const end = Math.min(i + CHUNK, length);
            let chunk = 0;
            for (let j = i; j < end; j++) {
                const code = text.charCodeAt(j);
                chunk = chunk * RADIX + (code < 128 ? LOOKUP[code] : -1);
            }
            result = result * POWERS[end - i] + BigInt(chunk);
        }
        return result;
    };
    const encodeUInt64 = (value, length = 11) => {
        let encoded = '';
        let q = BigInt(value);
        do {
            encoded = SYMBOLS[Number(q % BigInt(RADIX))] + encoded;
            q /= BigInt(RADIX);
        } while (q > 0);
        return encoded.padStart(length, '0');
    };
    return {
        decodeUInt64,
        encodeUInt64
    };
})();
export class Uid {
    upper;
    lower;
    constructor(upper, lower) {
        this.upper = upper;
        this.lower = lower;
    }
    get type() {
        const bitLength = this.lower.toString(2).length;
        const shiftBits = BigInt(bitLength - (bitLength % 8 || 8));
        return Number((this.lower >> shiftBits) & 0xffn);
    }
    static parse(text) {
        const upper = text.slice(0, 11);
        const lower = text.slice(11);
        return new Uid(Base62.decodeUInt64(upper), Base62.decodeUInt64(lower));
    }
    toString() {
        return Base62.encodeUInt64(this.upper, 11) + Base62.encodeUInt64(this.lower, 11);
    }
}
export class Deferred {
    promise;
    then;
    catch;
    finally;
    resolve;
    reject;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.then = this.promise.then.bind(this.promise);
        this.catch = this.promise.catch.bind(this.promise);
        this.finally = this.promise.finally.bind(this.promise);
    }
}
export class EventEmitter {
    listenersByType;
    constructor() {
        this.listenersByType = new Map();
    }
    on(name, callback, options) {
        return this.subscribe(name, callback, options);
    }
    once(name, callback) {
        return this.subscribe(name, callback, {
            once: true
        });
    }
    subscribe(name, callback, options) {
        let listener = new Listener(name, callback, this, options);
        listener.type = name;
        let set = this.listenersByType.get(listener.type);
        if (!set) {
            set = [];
            this.listenersByType.set(name, set);
        }
        set.push(listener);
        return listener;
    }
    unsubscribe(listener) {
        let set = this.listenersByType.get(listener.type);
        if (!set)
            return;
        let index = set.indexOf(listener);
        if (index > -1) {
            set.splice(index, 1);
            if (set.length == 0) {
                this.listenersByType.delete(listener.type);
            }
        }
    }
    trigger(e) {
        let set = this.listenersByType.get(e.type);
        if (!set)
            return;
        const toRemove = [];
        for (const listener of set) {
            listener.callback(e);
            if (listener.once)
                toRemove.push(listener);
        }
        for (const listener of toRemove) {
            listener.dispose();
        }
    }
    dispose() {
        this.listenersByType.clear();
    }
}
export class Listener {
    type;
    callback;
    reactive;
    signal;
    once;
    #abortListener;
    constructor(type, callback, reactive, options) {
        this.type = type;
        this.reactive = reactive;
        this.callback = callback;
        this.signal = options?.signal;
        this.once = options?.once === true;
        if (this.signal) {
            this.#abortListener = () => this.dispose();
            this.signal.addEventListener("abort", this.#abortListener, { once: true });
        }
    }
    abort() {
        this.dispose();
    }
    dispose() {
        this.reactive.unsubscribe(this);
        if (this.signal && this.#abortListener) {
            this.signal.removeEventListener("abort", this.#abortListener);
            this.#abortListener = undefined;
        }
    }
}
export function assertNotNull(value, message = "Expected value to be non-null") {
    if (value == null) {
        throw new Error(message);
    }
}
export function truncateWithEllipsis(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    const ellipsis = "ΓÇª";
    const sliceLength = Math.max(0, maxLength - ellipsis.length);
    return text.slice(0, sliceLength).trimEnd() + ellipsis;
}
export async function preloadImage(imgOrUrl) {
    return new Promise((resolve, reject) => {
        const img = typeof imgOrUrl === 'string' ? new Image() : imgOrUrl;
        if (img.complete && img.naturalWidth !== 0) {
            return resolve(img);
        }
        const cleanup = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
        };
        const onLoad = () => {
            cleanup();
            resolve(img);
        };
        const onError = (err) => {
            cleanup();
            reject(err || new Error('Image failed to load'));
        };
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        if (typeof imgOrUrl === 'string') {
            img.src = imgOrUrl;
        }
    });
}
export async function getFileHandle({ type = '*', multiple = false } = {}) {
    const mime = type === '*' ? '*/*' : `${type}/*`;
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.accept = mime;
        input.style.display = 'none';
        const cleanup = () => {
            input.value = '';
            input.remove();
        };
        input.onchange = () => {
            const files = input.files;
            if (files && files.length > 0) {
                resolve(multiple ? Array.from(files) : files[0]);
            }
            else {
                reject(new Error('No file selected'));
            }
            cleanup();
        };
        input.oncancel = () => {
            reject(new Error('File selection canceled'));
            cleanup();
        };
        document.body.appendChild(input);
        input.click();
    });
}
export function getErrorMessage(err) {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'string') {
        return err;
    }
    return String(err);
}
