import { setState } from "./gamestate"

export default function Tab(props: { name: string }) {
    return <button onClick={() => {
        setState("tabActive", props.name)
    }}>{props.name}</button>
}