import { createSignal, Show } from 'solid-js'
import './App.css'
import utils, { dataStore, setDatastore, state } from './gamestate';
import Tab from './Tab';
import Upgrade from './Upgrade';
import toast, { Toaster } from 'solid-toast';

let lastTime = Date.now();
let dt = NaN;
let tps = 20;
let maxTPS = 200;

const VERSION = "RA$-1.1.0"

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function tick(dt: number) {
	setDatastore("catsPerTick", dataStore.calculateCatsPerTick());
	setDatastore("cats", dataStore.cats.add(dataStore.catsPerTick.mul(dt)));
	if (dataStore.cats.gt(dataStore.catLimit)) { setDatastore("cats", dataStore.catLimit) };
}

function App() {
	const [newsTicker, setNewsTicker] = createSignal("mewo");
	setInterval(() => { setNewsTicker(utils.getRandomNewsTicker()); dataStore.save(localStorage.getItem("last address") ?? "", utils.getKey(localStorage.getItem("last key used"))) }, 10000);
	setInterval(async () => {
		dt = (Date.now() - lastTime) / 1000;
		lastTime = Date.now();
		await tick(dt);
		await sleep(tps);
	}, 1000 / maxTPS)

	let keyInput!: HTMLInputElement;
	let urlInput!: HTMLInputElement;

	dataStore.load(localStorage.getItem("last address") ?? "", utils.getKey(localStorage.getItem("last key used"))).then(() => toast.success("Loaded store from last key.")).catch((reason) => toast.error(`Couldn't load store: ${reason}`));

	return (
		<>
			<Toaster />
			<h4 style={{ position: 'fixed', bottom: 0, left: 0, color: "GrayText" }}>Catgame Remeowed Version {VERSION}</h4>
			<div style={{ position: "sticky" }}>
				<h3>{newsTicker()}</h3>
				<h4 style={{ color: "GrayText" }}>The Cat Limit is {dataStore.catLimit.toString()} cats</h4>
				<progress max={100} value={dataStore.cats.dividedBy(dataStore.catLimit).times(100).toNumber()}></progress>
				<span>{dataStore.cats.dividedBy(dataStore.catLimit).times(100).toPrecision(3)}%</span>
				<h4>You have <span class='game-value-display'>{dataStore.cats.toStringWithDecimalPlaces(2)}</span> cats</h4>
				<h5>You gain <span class='game-value-display'>{dataStore.catsPerTick.toStringWithDecimalPlaces(2)}</span> cats per tick</h5>
				<div>
					<Tab name='Main' />
					<Tab name="Cat Limit" />
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
				<br />
				<input ref={urlInput} id="url-input" type="text" onchange={(ev) => { localStorage.setItem("last address", ev.target.value) }} value={localStorage.getItem("last address") ?? ""} />
				<br />
				<br />
				<label for="key-input">Key (leave empty for random generated key (the random generated key is stored on your local storage))</label>
				<br />
				<input ref={keyInput} id="key-input" type="text" />
				<br />
				<br />
				<button onclick={() => { dataStore.save(urlInput.value, keyInput.value) }}>Save</button>
				<button onclick={() => { dataStore.load(urlInput.value, keyInput.value) }}>Load</button>
				<button onclick={() => { localStorage.removeItem("key"); localStorage.removeItem("last key used") }}>Reset Key</button>
			</Show>
			<Show when={state.tabActive === "Cat Limit"}>
				<h3>You are on CL{dataStore.catLimit.log(1000).toString()}</h3>
				<button onclick={() => {
					if (dataStore.cats.lt(dataStore.catLimit)) return;
					dataStore.clReset();
					setDatastore("catLimit", dataStore.catLimit.mul(1000));
				}}>Reset for cat limit increase</button>
			</Show>
			<Show when={state.tabActive === "null"}>
				<p>Loafing...</p>
			</Show>
		</>
	)
}

export default App
