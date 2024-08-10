import Decimal from "break_eternity.js";
import { createStore, reconcile } from "solid-js/store";
import toast from "solid-toast";

const newsTickerMessages = ["owo", "uwu", "hello", "uparrow", "x^2", "mewo", "did you know that [REDACTED]?", "Arch Linux", "register gaining"]

const utils = {
    getRandomNewsTicker() {
        return newsTickerMessages[Math.floor(Math.random() * newsTickerMessages.length)];
    },
    getKey(key: string | null = null) {
        if (key) return key;
        const lkey = localStorage.getItem("key");
        if (!lkey) {
            localStorage.setItem("key", this.cyrb53("SEK" + Math.random()).toString());
            return localStorage.getItem("key")!;
        } else {
            return lkey;
        }
    },
    cyrb53(str: string, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    },
    validKey(key: string) {
        return key.startsWith(this.cyrb53("SEK").toString());
    }
}

class Upgrade {
    level: Decimal = Decimal.dZero;
    constructor(public name: string, private nextCost1: number, private nextCost2: number, public buySuccess: VoidFunction) { }
    get cost() {
        return new Decimal(this.nextCost1).times(new Decimal(this.nextCost2).pow(this.level))
    }
}

export const [dataStore, setDatastore] = createStore({
    cats: new Decimal(11),
    catLimit: new Decimal(1000),
    catsPerTick: Decimal.dZero,
    multiplier: Decimal.dOne,
    upgrades: {
        catSummoner: new Upgrade("Cat Summoner", 10, 1.75, () => {
            setDatastore("catsPerTick", dataStore.catsPerTick.plus(1))
        }),
        catFood: new Upgrade("Cat Food", 25, 2.05, () => {

        })
    } as { [key: string]: Upgrade },
    async save(url: string | null, key: string | null = null) {
        if (!key) key = utils.getKey();
        if (!url) { this.saveLocal(key); return; }
        const resp = fetch(`${url}/set/${key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataStore)
        })
        toast.promise(resp, {
            loading: "Saving...",
            success: "Saved to server.",
            error: `Failed to save to server. Error ${(await resp).status} - ${(await resp).statusText}`
        })
    },
    saveLocal(key: string | null = null) {
        localStorage.setItem(key ?? utils.getKey(), JSON.stringify(dataStore))
        toast.success("Saved to device.")
    },
    async load(url: string | null, key: string | null = null) {
        if (!key) key = utils.getKey();
        if (!url) { this.loadLocal(key); return; }
        const resp = fetch(`${url}/set/${key}`, { method: "GET" });
        resp.then((r) => {
            toast.promise(r.json(), {
                loading: "Loading JSON data...",
                success: "Successfully loaded JSON.",
                error: "Couldn't load JSON from server."
            }).then((json: any) => {
                setDatastore(reconcile(json));
            })
        })
        toast.promise(resp, {
            loading: "Loading...",
            success: "Loaded from server.",
            error: `Failed to load from server. Error ${(await resp).status} - ${(await resp).statusText}`
        })
    },
    loadLocal(key: string | null = null) {
        const data = JSON.parse(localStorage.getItem(key ?? utils.getKey()) ?? "null")
        if (!data) {
            toast.error("There is no store with that key!");
            return;
        }
        setDatastore(reconcile(data));
        toast.success("Loaded from local storage.");
    }
})

export const [state, setState] = createStore({
    tabActive: "Main"
})

export default utils;
