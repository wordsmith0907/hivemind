import * as api from './api.js';
import { Deferred, EventEmitter, Flag, isIPad } from './util.js';
import { Logger } from './diagnostics.js';
const configEl = document.getElementById('config');
const mymindConfigData = configEl ? JSON.parse(configEl.textContent) : {};
let rive = undefined;
globalThis.mymind = {
    checkpoint: 0n,
    config: mymindConfigData,
    quotas: mymindConfigData.quotas ?? {},
    features: new Set(mymindConfigData.features ?? []),
    templates: {},
    reactive: new EventEmitter(),
    ready: new Deferred(),
    isOnline: navigator.onLine,
    modified: new Date(),
    logger: new Logger(),
    views: {},
    fadeGridOnFocus: false,
    on(type, callback, options) {
        return this.reactive.on(type, callback, options);
    },
    get colorScheme() {
        return this.config.colorScheme ?? 'system';
    },
    get resolvedColorScheme() {
        let scheme = this.colorScheme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (scheme === 'system')
            return prefersDark.matches ? 'dark' : 'light';
        return scheme;
    },
    get host() {
        return this.config.environmentName == 'Development' ? 'dev.mymind.com' : 'access.mymind.com';
    },
    get ui() {
        return this.config.ui ?? {};
    },
    set ui(value) {
        this.config.ui = value;
    },
    set colorScheme(value) {
        this.config ??= {};
        this.config.colorScheme = value;
        let ss = document.getElementById('dark-stylesheet');
        if (!ss)
            return;
        ss.disabled = value === 'light';
        if (value === 'dark') {
            ss.media = 'all';
        }
        else if (value === 'system') {
            ss.media = '(prefers-color-scheme: dark)';
        }
        mymind.logger.info(`[Color Scheme] updated to ${value}`);
        mymind.trigger({ type: 'colorScheme:change', value });
    },
    get objectQuota() {
        if (!mymind.quotas) {
            return { count: 0, limit: 100 };
        }
        return mymind.quotas.objects;
    },
    set objectQuota(value) {
        let c = mymind.quotas.objects;
        if (c && value.count === c.count && value.limit === c.limit) {
            return;
        }
        mymind.quotas.objects = value;
        mymind.logger.info(`[Quota Change] (${value.count}, ${value.limit})`);
        mymind.trigger({
            type: 'objectQuota:change',
            count: value.count,
            limit: value.limit
        });
    },
    get onboardFlags() {
        return new Flag(this.config.onboardFlags ?? 0);
    },
    get userFlags() {
        return new Flag(this.config.user.flags ?? 0);
    },
    trigger(e) {
        switch (e.type) {
            case 'navigate':
                if (mymind.app?.navigate) {
                    mymind.app.navigate(e.path);
                }
                break;
            default:
                this.reactive.trigger(e);
                break;
        }
    },
    showPrivateObjects: false,
    get isEmpty() {
        return document.body.classList.contains('empty');
    },
    get isGuest() {
        return this.config.isGuest;
    },
    get testCase() {
        return this.config.testCase;
    },
    hasFeature(name) {
        return this.features.has(name);
    },
    get canUpgrade() {
        return !this.hasFeature('video');
    },
    get objectLimitReached() {
        if (this.objectQuota === undefined)
            return false;
        return this.objectQuota.count >= this.objectQuota.limit;
    },
    get hidePrivateObjects() {
        return !this.showPrivateObjects;
    },
    get soundEnabled() {
        return !this.userFlags.has(64);
    },
    set soundEnabled(value) {
        if (value) {
            this.userFlags.delete(64);
        }
        else {
            this.userFlags.add(64);
        }
    },
    get device() {
        if (isIPad) {
            return 'iPad';
        }
        return null;
    },
    get platform() {
        return this.config.platform ?? 'Unknown';
    },
    get channel() {
        return this.config.channel ?? 'Stable';
    },
    scrollLock: {
        get enabled() {
            return document.body.classList.contains('scroll-lock');
        },
        enable() {
            document.body.classList.add('scroll-lock');
        },
        disable() {
            document.body.classList.remove('scroll-lock');
        }
    },
    onboarding: {
        hasFlag(value) {
            return mymind.onboardFlags.has(value);
        },
        async setFlag(value) {
            await api.post(`/onboard/flags/${value}/set`);
            mymind.config.onboardFlags |= value;
        },
        async unsetFlag(value) {
            await api.post(`/onboard/flags/${value}/unset`);
            mymind.config.onboardFlags &= ~value;
        }
    },
    get account() {
        return this.config.account;
    },
    get user() {
        return this.config.user;
    },
    assets: {
        getPath(path) {
            if (path[0] == '/') {
                path = path.substring(1);
            }
            return mymind.config.assets.baseUrl + path;
        }
    },
    get isDevelopmentEnvironment() {
        return mymind.config.environmentName === 'Development';
    },
    async getRive() {
        if (rive === undefined) {
            let module = await import('./vendor/rive.min.js');
            rive = module.default;
            rive.RuntimeLoader.setWasmUrl(mymind.assets.getPath('/scripts/vendor/rive.wasm'));
        }
        return rive;
    },
    updateUI() {
        if (mymind.serviceWorker) {
            mymind.serviceWorker.reload();
        }
        else {
            location.reload();
        }
        return true;
    },
    get isLimitReached() {
        return document.body.classList.contains('limit-reached');
    },
    notify(message, options) {
    },
    hubDelay: 50
};
Carbon.controllers['page'] = {
    animateIn(e) {
        requestAnimationFrame(() => {
            e.target.classList.add('run');
        });
    }
};
