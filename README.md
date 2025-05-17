event-emitter

A small event emitter library, designed for use in front-end applications
like Svelte applications.

This provides a nice way to connect different parts of an application whilst
keeping the underlying components decoupled from each other.

## Installation

```shell
npm i @anephenix/event-emitter
```

## Usage

```typescript
// Load the dependency class
import EventEmitter from "@anephenix/event-emitter";

// Create an instance of the event emitter class with type safety
const eventEmitter = new EventEmitter();
```

We can now pass that eventEmitter instance to the places where we want to
either trigger an event or react to an event.

Whether you do that by loading the eventEmitter instance as a dependency
within a file, or by passing it as a parameter to a function is completely
up to you. The important thing is that you use the same eventEmitter
instance for handling the events that you want to trigger and react to.

### Triggering an event

To trigger an event, you call the `.emit` function on the eventEmitter
instance with the name of the event, and the data that you wish to pass along
with that event.

```typescript
const data = { name: "John", text: "Hello" };
eventEmitter.emit("message", data);
```

### Handling an event

To handle an event, you call the `.on` function on the eventEmitter instance
with the name of the event, and a listener function that handles the data payload
received when the event is triggered.

```typescript
const messages = [];

function handleMessage(data: { name: string; text: string }) {
    messages.push(data);
}

eventEmitter.on("message", handleMessage);
```

You can trigger and handle as many events as you like, and even add multiple
handler functions for the same event.

### Removing event handlers

To clean up event handlers that are no longer required (e.g. for a component
that is no longer in view), you can call the `.off` function with a reference
to the function that was passed to the `.on` function:

```typescript
eventEmitter.off("message", handleMessage);
```

### Applying Type Safety to events names and their payloads

You may find that you'll want to add some type safety to the list of event 
names that are used in your application, as well as the data payloads that
they emit and pass to handler functions.

The library allows you to define that by using a Type that is passed to the
setup of the EventEmitter instance, like this:

```typescript
interface MyEvents {
  message: (data: string) => void;
  join: (username: string) => void;
  leave: (username: string) => void;
}

const emitter = new EventEmitter<MyEvents>();
```

This will then provide a way to ensure that calls to emit events and react to 
them are type-checked:

```typescript
emitter.on('join', (username:string) => {
    console.log(`${username} joined`);
});

emitter.emit("join", "Alice");
```

This will help with preventing the misspelling of event names and also ensuring 
that the event data payloads are correct.

## Tests

You can run the unit tests using this command:

```shell
npm t
```

## Licence and Credits

&copy;2025 Anephenix OÜ. EventEmitter is licenced under the MIT licence.