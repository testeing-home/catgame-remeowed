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
            localStorage.setItem("key", this.cyrb53("SEK") + this.cyrb53(Math.random().toString()).toString());
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
    constructor(public name: string, private nextCost1: number, private nextCost2: number, public level = Decimal.dZero, public buySuccess: VoidFunction = () => { }) { }
    get cost() {
        return new Decimal(this.nextCost1).times(new Decimal(this.nextCost2).pow(this.level))
    }
}

export const [dataStore, setDatastore] = createStore({
    cats: new Decimal(11),
    catLimit: new Decimal(1000),
    calculateCatsPerTick() {
        // TODO: Better magic
        const baseCPT: Decimal = this.upgrades.catSummoner.level.pow(1).times(new Decimal(1.75).pow(this.upgrades.catFood.level));

        const clBoost = new Decimal(1.05).pow(this.catLimit.log(1000).minus(1));

        const final = baseCPT.times(clBoost)

        return final;
    },
    catsPerTick: Decimal.dZero,
    multiplier: Decimal.dOne,
    upgrades: {
        catSummoner: new Upgrade("Cat Summoner", 10, 1.75),
        catFood: new Upgrade("Cat Food", 25, 2.05)
    } as { [key: string]: Upgrade },
    async save(url: string, key: string | null = null) {
        if (!key) key = utils.getKey();
        if (!utils.validKey(key)) {
            toast.error("Invalid key!");
            return;
        }
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
    saveLocal(key: string = "") {
        localStorage.setItem(key ?? utils.getKey(), JSON.stringify(dataStore))
        toast.success("Saved to device.")
    },
    async load(url: string, key: string = "") {
        if (!key) key = utils.getKey();
        if (!utils.validKey(key)) {
            toast.error("Invalid key!");
            return;
        }
        if (!url) { this.loadLocal(key); return; }
        const resp = fetch(`${url}/get/${key}`, { method: "GET" });
        let jsonFailed = false;
        resp.then((r) => {
            // r.body?.getReader().read().then((v) => { console.debug(new TextDecoder().decode(v.value)) })
            // r.text().then((v) => console.debug(v));
            toast.promise(r.json(), {
                loading: "Loading JSON data...",
                success: "Successfully loaded JSON.",
                error: "Couldn't load JSON from server."
            }).then((json: any) => {
                console.debug(`Incoming JSON data: ${json}`);
                // const dataStoreTemp: { [key: string]: any } = {}
                for (const [key, value] of Object.entries(json)) {
                    if (typeof value === "string") {
                        json[key] = new Decimal(value);
                    }
                    if (key === "upgrades") {
                        // console.debug(key, value)
                        //@ts-expect-error
                        for (const upgradeSet of Object.entries(value)) {
                            const name = upgradeSet[0]
                            const upgrade: any = upgradeSet[1]
                            // console.debug(key, value)
                            // console.debug(name, upgrade)
                            json[key][name] = new Upgrade(upgrade.name, upgrade.nextCost1, upgrade.nextCost2, new Decimal(upgrade.level), dataStore.upgrades[name].buySuccess)
                        }
                    }
                    // if (key === "catsPerTick") continue;
                    // console.debug(">> Enter if exist loop")
                    for (const [dk, dv] of Object.entries(this)) {
                        // if (dk === "catsPerTick") continue;
                        // console.debug(dk, dv)
                        if (!Object.keys(json).includes(dk)) {
                            json[dk] = dv
                        }
                    }
                }
                // console.log(dataStoreTemp)
                setDatastore(reconcile(json));
                localStorage.setItem("last key used", key)
            })
            // .catch((reason) => {
            //     console.error(`JSON Request Failed: ${reason}`)
            //     jsonFailed = true;
            // })
        })
        if (jsonFailed) return;
        toast.promise(resp, {
            loading: "Loading...",
            success: "Loaded from server.",
            error: `Failed to load from server. Error ${(await resp).status} - ${(await resp).statusText}`
        })
    },
    loadLocal(key: string = "") {
        const data = JSON.parse(localStorage.getItem(key ?? utils.getKey()) ?? "null")
        if (!data) {
            toast.error("There is no store with that key!");
            return;
        }
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "string") {
                data[key] = new Decimal(value);
            }
            if (key === "upgrades") {
                //@ts-expect-error
                for (const upgradeSet of Object.entries(value)) {
                    const name = upgradeSet[0]
                    const upgrade: any = upgradeSet[1]
                    console.debug(key, value)
                    console.debug(upgradeSet, name, upgrade)
                    data[key][name] = new Upgrade(upgrade.name, upgrade.nextCost1, upgrade.nextCost2, new Decimal(upgrade.level), dataStore.upgrades[name].buySuccess)
                }
            }
            for (const [dk, dv] of Object.entries(this)) {
                if (!Object.keys(data).includes(dk)) {
                    data[dk] = dv
                }
            }
        }
        setDatastore(reconcile(data));
        toast.success("Loaded from local storage.");
    },
    clReset() {
        setDatastore("cats", new Decimal(11));
        for (const upgrade of Object.values(this.upgrades)) {
            upgrade.level = Decimal.dZero;
        }
    }
})

export const [state, setState] = createStore({
    tabActive: "Main"
})

export default utils;
