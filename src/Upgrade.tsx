import { dataStore } from "./gamestate";

export default function Upgrade(props: { name: string }) {
    return <p>
        <span>({dataStore.upgrades[props.name].level.toString()})</span>
        <span>({dataStore.upgrades[props.name].name})</span>
        <button>Buy for {dataStore.upgrades[props.name].cost.toString()} Cats</button>
        <span></span>
    </p>
}