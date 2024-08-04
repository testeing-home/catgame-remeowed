import { createSignal, Show } from 'solid-js'
import './App.css'
import utils, { dataStore, state } from './gamestate';
import Tab from './Tab';



function App() {
	const [newsTicker, setNewsTicker] = createSignal("mewo");
	setInterval(() => setNewsTicker(utils.getRandomNewsTicker()), 10000);

	return (
		<>
			<div style={{ position: "sticky" }}>
				<h3>{newsTicker()}</h3>
				<h4 style={{ color: "GrayText" }}>The Cat Limit is {dataStore.catLimit.toString()} cats</h4>
				<progress max={100} value={dataStore.cats.dividedBy(dataStore.catLimit).times(100).toNumber()}>{dataStore.cats.dividedBy(dataStore.catLimit).times(100).toPrecision(2)}%</progress>
				<div>
					<Tab name='Main' />
					<Tab name='Options' />
				</div>
			</div>
			<Show when={state.tabActive === "Main"}>
				<h2>You have {dataStore.cats.toString()} cats</h2>
				<h2>You gain {dataStore.catsPerSecond.toString()} cats per second</h2>
			</Show>
			<Show when={state.tabActive === "Options"}>
				<h3>You have played for Unknown ago</h3>
				<h3>Your highest cats are Unknown Cats</h3>
			</Show>
		</>
	)
}

export default App
