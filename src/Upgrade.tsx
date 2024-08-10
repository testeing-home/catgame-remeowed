import { dataStore, setDatastore, setState } from "./gamestate";

export default function Upgrade(props: { name: string }) {
    return <p>
        <span>({dataStore.upgrades[props.name].level.toString()})</span>
        <span>({dataStore.upgrades[props.name].name})</span>
        <button onClick={() => {
            if (dataStore.cats.gte(dataStore.upgrades[props.name].cost)) {
                setDatastore("cats", dataStore.cats.sub(dataStore.upgrades[props.name].cost))
                dataStore.upgrades[props.name].buySuccess()
                dataStore.upgrades[props.name].level = dataStore.upgrades[props.name].level.add(1);
                setState("tabActive", "null");
                setState("tabActive", "Main");
            }
        }}>Buy for {dataStore.upgrades[props.name].cost.toStringWithDecimalPlaces(2)} Cats</button>
        <span></span>
    </p>
}