import { createSignal, Show } from 'solid-js'
import './App.css'
import utils, { dataStore, setDatastore, state } from './gamestate';
import Tab from './Tab';
import Upgrade from './Upgrade';
import { Toaster } from 'solid-toast';

let lastTime = Date.now();
let dt = NaN;
let tps = 20;
let maxTPS = 200;

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function tick(dt: number) {
	setDatastore("cats", dataStore.cats.add(dataStore.catsPerTick.mul(dt)));
	if (dataStore.cats.gt(dataStore.catLimit)) { setDatastore("cats", dataStore.catLimit) };
}

function App() {
	const [newsTicker, setNewsTicker] = createSignal("mewo");
	setInterval(() => setNewsTicker(utils.getRandomNewsTicker()), 10000);
	setInterval(async () => {
		dt = (Date.now() - lastTime) / 1000;
		lastTime = Date.now();
		await tick(dt);
		await sleep(tps);
	}, 1000 / maxTPS)

	let keyInput!: HTMLInputElement;
	let urlInput!: HTMLInputElement;

	return (
		<>
			<Toaster />
			<div style={{ position: "sticky" }}>
				<h3>{newsTicker()}</h3>
				<h4 style={{ color: "GrayText" }}>The Cat Limit is {dataStore.catLimit.toString()} cats</h4>
				<progress max={100} value={dataStore.cats.dividedBy(dataStore.catLimit).times(100).toNumber()}></progress>
				<span>{dataStore.cats.dividedBy(dataStore.catLimit).times(100).toPrecision(2)}%</span>
				<h4>You have <span class='game-value-display'>{dataStore.cats.toStringWithDecimalPlaces(2)}</span> cats</h4>
				<h5>You gain <span class='game-value-display'>{dataStore.catsPerTick.toStringWithDecimalPlaces(2)}</span> cats per tick</h5>
				<div>
					<Tab name='Main' />
					<Tab name='Options' />
				</div>
			</div>
			<Show when={state.tabActive === "Main"}>
				<Upgrade name="catSummoner" />
				<Upgrade name="catFood" />
			</Show>
			<Show when={state.tabActive === "Options"}>
				<h4>You have played for Unknown ago</h4>
				<h4>Your highest cats are Unknown Cats</h4>
				<br />
				<h3>Datastore</h3>
				<label for="url-input">Server address (leave empty for local)</label>
				<input ref={urlInput} id="url-input" type="text" onchange={(ev) => { localStorage.setItem("last address", ev.target.value) }} value={localStorage.getItem("last address") ?? ""} />
				<label for="key-input">Key (leave empty for random generated key (the random generated key is stored on your local storage))</label>
				<input ref={keyInput} id="key-input" type="text" />
				<button onclick={() => { dataStore.save(urlInput.value, keyInput.value) }}>Save</button>
				<button onclick={() => { dataStore.load(urlInput.value, keyInput.value) }}>Load</button>
				<button onclick={() => { localStorage.removeItem("key") }}>Reset Key</button>
			</Show>
			<Show when={state.tabActive === "null"}>
				<p>Loafing...</p>
			</Show>
		</>
	)
}

export default App
