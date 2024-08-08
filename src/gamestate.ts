import Decimal from "break_eternity.js";
import { createStore } from "solid-js/store";

const newsTickerMessages = ["owo", "uwu", "hello", "uparrow", "x^2", "mewo", "did you know that [REDACTED]?", "Arch Linux", "register gaining"]

const utils = {
    getRandomNewsTicker() {
        return newsTickerMessages[Math.floor(Math.random() * newsTickerMessages.length)];
    },
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
    catsPerSecond: Decimal.dZero,
    multiplier: Decimal.dOne,
    upgrades: {
        catSummoner: new Upgrade("Cat Summoner", 10, 1.75, () => {
            setDatastore("catsPerSecond", dataStore.catsPerSecond.plus(1))
        }),
        catFood: new Upgrade("Cat Food", 25, 2.05, () => {

        })
    } as {[key: string]: Upgrade}
})

export const [state, setState] = createStore({
    tabActive: "Main"
})

export default utils;
