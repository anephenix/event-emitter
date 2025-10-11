import { describe, expect, test, vi } from "vitest";
import EventEmitter from "../src/EventEmitter";

type MyEvents = {
	event1: () => void;
	event2: () => void;
	testEvent: (...args: unknown[]) => void;
	anotherEvent: () => void;
};

describe("EventEmitter", () => {
	describe(".enableLogging", () => {
		test("should not log by default as logging is set to false", () => {
			const emitter = new EventEmitter<MyEvents>();
			expect(emitter.enableLogging).toBe(false);
		});

		test("should log when enableLogging is set to true", () => {
			const emitter = new EventEmitter<MyEvents>();
			emitter.enableLogging = true;
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			emitter.emit("testEvent");
			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		test("should not log when enableLogging is set to false", () => {
			const emitter = new EventEmitter<MyEvents>();
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			emitter.emit("testEvent");
			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe("on", () => {
		test("should add a listener for an event", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			emitter.on("testEvent", listener);
			expect(emitter.events.testEvent).toContain(listener);
		});

		describe("when passed an array of event names", () => {
			test("should add the listener to each event", () => {
				const emitter = new EventEmitter<MyEvents>();
				const listener = vi.fn();
				const events: (keyof MyEvents)[] = ["event1", "event2"];
				emitter.on(["event1", "event2"], listener);
				expect(emitter.events.event1).toContain(listener);
				expect(emitter.events.event2).toContain(listener);
			});
		});
	});

	describe("off", () => {
		test("should remove a listener for an event", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			emitter.on("testEvent", listener);
			emitter.off("testEvent", listener);
			expect(emitter.events.testEvent).not.toContain(listener);
		});

		test("should not throw when removing a non-existent listener", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			const anotherListener = () => "2 + 2 is 4 - 1 that's 3 quick maths";
			emitter.on("testEvent", anotherListener);
			expect(() => emitter.off("testEvent", listener)).not.toThrow();
		});

		describe("when passed an array of event names", () => {
			test("should remove the listener from each event", () => {
				const emitter = new EventEmitter<MyEvents>();
				const listener = vi.fn();
				const events: (keyof MyEvents)[] = ["event1", "event2"];
				emitter.on(["event1", "event2"], listener);
				expect(emitter.events.event1).toContain(listener);
				expect(emitter.events.event2).toContain(listener);
				emitter.off(["event1", "event2"], listener);
				expect(emitter.events.event1).not.toContain(listener);
				expect(emitter.events.event2).not.toContain(listener);
			});
		});
	});

	describe("emit", () => {
		test("should call the listener for an event", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			emitter.on("testEvent", listener);
			emitter.emit("testEvent");
			expect(listener).toHaveBeenCalled();
		});

		test("should pass arguments to the listener", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			emitter.on("testEvent", listener);
			emitter.emit("testEvent", "arg1", "arg2");
			expect(listener).toHaveBeenCalledWith("arg1", "arg2");
		});

		test("should not call listeners for a different event", () => {
			const emitter = new EventEmitter<MyEvents>();
			const listener = vi.fn();
			emitter.on("testEvent", listener);
			emitter.emit("anotherEvent");
			expect(listener).not.toHaveBeenCalled();
		});
	});
});
