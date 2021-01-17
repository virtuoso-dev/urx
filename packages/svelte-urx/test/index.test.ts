import {
	Readable, Writable,
} from 'svelte/store';
import {
	AnySystemSpec,
	statefulStream, publish, system, stream, connect,
} from '@virtuoso.dev/urx';
import {
	systemToStores, streamToReadable, streamToWritable,
} from '../src';


function isValidReadable(store: Readable<any>) {
	expect(store).not.toBeNull();
	expect(typeof store).toBe('object');
	expect(store).toHaveProperty('subscribe');
}

function isValidWritable(store: Writable<any>) {
	expect(store).not.toBeNull();
	expect(typeof store).toBe('object');
	expect(store).toHaveProperty('subscribe');
	expect(store).toHaveProperty('set');
	expect(store).toHaveProperty('update');
}

describe('readable store from stream', () => {
	const simpleStream = () => statefulStream<number>(42);

	it('returns a valid readable store', () => {
		const store = streamToReadable(simpleStream());

		isValidReadable(store);
	});

	it('has a working subscribe method', () => {
		const stream = simpleStream();
		const store = streamToReadable(stream);

		expect(typeof store.subscribe).toBe('function');

		const sub = jest.fn();
		store.subscribe(value => sub(value));

		expect(sub).toHaveBeenCalledWith(42);
		expect(sub).toHaveBeenCalledTimes(1);

		publish(stream, 21);
		expect(sub).toHaveBeenCalledWith(21);
		expect(sub).toHaveBeenCalledTimes(2);
	});
});

describe('writable store from stream', () => {
	const simpleStream = () => statefulStream<number>(42);

	it('returns a valid writable store', () => {
		const store = streamToWritable(simpleStream());

		isValidWritable(store);
	});

	it('has a working set method', () => {
		const store = streamToWritable<number, AnySystemSpec>(simpleStream());

		expect(typeof store.set).toBe('function');

		const sub = jest.fn();
		store.subscribe(value => sub(value));

		expect(sub).toHaveBeenCalledWith(42);
		expect(sub).toHaveBeenCalledTimes(1);

		store.set(21);
		expect(sub).toHaveBeenCalledWith(21);
		expect(sub).toHaveBeenCalledTimes(2);
	});

	it('has a working update method', () => {
		const store = streamToWritable<number, AnySystemSpec>(simpleStream());

		expect(typeof store.update).toBe('function');

		const sub = jest.fn();
		store.subscribe(value => sub(value));

		expect(sub).toHaveBeenCalledWith(42);
		expect(sub).toHaveBeenCalledTimes(1);

		store.update((n) => n / 2);
		expect(sub).toHaveBeenCalledWith(21);
		expect(sub).toHaveBeenCalledTimes(2);
	});
});

describe('stores from system', () => {
	const simpleSystem = () =>
		system(() => {
			const prop = stream<number>();
			const depot = statefulStream(10);
			connect(prop, depot);

			return { prop, depot };
		});

	it('returns valid svelte stores', () => {
		const stores = systemToStores(simpleSystem());

		expect(stores).not.toBeNull();
		expect(typeof stores).toBe('object');

		expect(stores).toHaveProperty('prop');
		isValidWritable(stores.prop);

		expect(stores).toHaveProperty('depot');
		isValidWritable(stores.depot);
	});

	it('returns stores that are connected', () => {
		const { prop, depot } = systemToStores(simpleSystem());

		const sub1 = jest.fn();
		prop.subscribe(() => sub1());

		const sub2 = jest.fn();
		depot.subscribe(value => sub2(value));

		expect(sub1).toHaveBeenCalledTimes(0);
		expect(sub2).toHaveBeenCalledTimes(1);
		expect(sub2).toHaveBeenCalledWith(10);

		prop.set(20);

		expect(sub1).toHaveBeenCalledTimes(1);
		expect(sub2).toHaveBeenCalledTimes(2);
		expect(sub2).toHaveBeenCalledWith(20);
	});
});