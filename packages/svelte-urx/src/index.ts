import {
	Readable, Writable,
} from 'svelte/store';
import {
	AnySystemSpec, SR,
	init, publish, subscribe, getValue,
} from '@virtuoso.dev/urx';

/**
 * @internal (from svelte/store)
 * Callback to inform of a value updates.
 */
export declare type Subscriber<T> = (value: T) => void;

/**
 * @internal (from svelte/store)
 * Unsubscribes from value updates.
 */
export declare type Unsubscriber = () => void;

/**
 * @internal (from svelte/store)
 * Callback to update a value.
 */
export declare type Updater<T> = (value: T) => T;

/** @internal */
export interface Stores<T> {
	[key: string]: Writable<T>
}

/**
 * Converts a stream to a readable svelte store.
 * @param stream The stream to convert.
 * @returns A readable svelte store with its "subscribe" method
 */
export const streamToReadable = <T, SS extends AnySystemSpec>(
	stream: SR<SS>,
): Readable<T> => ({
	subscribe: (run: Subscriber<T>): Unsubscriber => subscribe(stream, run)
});

/**
 * Converts a stream to a writable svelte store.
 * @param stream The stream to convert.
 * @returns A writable svelte store with its "subscribe", "update" and "set" methods
 */
export const streamToWritable = <T, SS extends AnySystemSpec>(
	stream: SR<SS>,
): Writable<T> => ({
	subscribe: streamToReadable<T, SS>(stream).subscribe,
	update:    (updater: Updater<T>) => publish(stream, updater(getValue(stream))),
	set:       (value: T) => publish(stream, value),
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
		(stores: Stores<any>, [key, stream]) => {
			stores[key] = streamToWritable(stream);
			return stores;
		}, {},
	);