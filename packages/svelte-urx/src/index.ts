import type {
	Writable,
} from 'svelte/store';
import {
	AnySystemSpec, SR,
	init, publish, subscribe, getValue,
} from '@virtuoso.dev/urx';

/**
 * @internal (from svelte/store)
 * Callback to inform of a value updates.
 */
declare type Subscriber<T> = (value: T) => void;

/**
 * @internal (from svelte/store)
 * Unsubscribes from value updates.
 */
declare type Unsubscriber = () => void;

/**
 * @internal (from svelte/store)
 * Callback to update a value.
 */
declare type Updater<T> = (value: T) => T;

interface Stores {
	[key: string]: Writable<any>
}

/**
 * Converts a stream to a svelte store.
 * @param stream The stream to convert.
 * @returns A svelte store with it's "subscribe", "update" and "set" methods
 */
export const streamToStore = <T, SS extends AnySystemSpec>(
	stream: SR<SS>,
) => ({
	subscribe: (run: Subscriber<T>): Unsubscriber =>
		           subscribe(stream, run),

	update: (updater: Updater<T>) =>
		        publish(stream, updater(getValue(stream))),

	set: (value: T) => publish(stream, value),
});

/**
 * Converts a system spec to multiple svelte stores.
 * @param systemSpec
 * @returns An object with the the svelte stores for each stream in the system
 */
export const systemToStores = <SS extends AnySystemSpec>(
	systemSpec: SS,
) => Object
	.entries(init(systemSpec))
	.reduce(
		(stores: Stores, [key, stream]) => {
			stores[key] = streamToStore(stream);
			return stores;
		}, {},
	);