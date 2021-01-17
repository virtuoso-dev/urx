<script>
	import { systemToStores } from '../src/';
	import { system, statefulStream, combineLatest, map, pipe, statefulStreamFromEmitter, init, subscribe, publish } from '@virtuoso.dev/urx';

	const sys = system(() => {
		const a = statefulStream(0);
		const b = statefulStream(0);

		// construct an emitter summing the two streams.
		const aPlusB = pipe(
			combineLatest(a, b),
			map(([ a, b ]) => a + b),
		);

		// output streams must be stateful
		// so we convert the emitter to a stateful stream
		const sum = statefulStreamFromEmitter(aPlusB, 0);

		return { a, b, sum };
	});

	const { a, b, sum } = init(sys);

	subscribe(sum, (sum) => console.log({ sum }));
	publish(a, 5);
	publish(b, 7);

	const { a: aStore, b: bStore, sum: sumStore } = systemToStores(sys);
</script>

<div>
	<label for="input-a">Input A value:</label>
	<input type="range" id="input-a" name="input-a" min="0" max="10"
	       bind:value={$aStore} />
</div>

<div>
	<label for="input-b">Input B value:</label>
	<input type="number" id="input-b" name="input-b" size="5"
	       bind:value={$bStore} />

	<div>
		<button on:click={() => bStore.update(n => n + 1)}>+</button>
		<button on:click={() => bStore.update(n => n - 1)}>-</button>
	</div>
</div>

<h4>Sum: {$sumStore}</h4>