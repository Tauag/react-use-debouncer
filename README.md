# react-use-debouncer

A simple debounced state hook that I use on some of my projects.

Install with npm:<br/>
`npm i --save react-use-debouncer`

or via yarn:<br/>
`yarn i react-use-debouncer`

## Features

- Debounced state

## Usage

### useDebouncedState

```javascript
import { useDebouncedState } from 'react-use-debouncer';

const useStateExample = () => {
  const [state, setState] = useDebouncedState('Initial');

  return (
    <div className="App">
      <span>{state}</span>
      <input onChange={({ target: { value } }) => setState(value)} />
    </div>
  );
};
```

### useDebouncedCallback

```javascript
import { useDebouncedCallback } from 'react-use-debouncer';

const sampleFunction = () => console.log('There should be a delay before I appear!');

const useCallbackExample = () => {
  const [debouncedCallback, cancelCallback] = useDebouncedCallback(sampleFunction);

  return <button onClick={() => debouncedCallback()}>Click Me!</button>;
};
```

Or check it out on [CodeSandbox](https://codesandbox.io/embed/hardcore-goodall-iiwym?fontsize=14&hidenavigation=1&theme=dark)

## Syntax

```javascript
const [state, setState] = setDebouncedState(initialValue, delay);
```

### Parameters

- **initialValue**: The initial value that state is initialized with
- **delay**(_optional_): Number indicating the milliseconds to wait before setting state

### Return

Returns an array containing the debounced state and a setState function.

`ex: [state, setState]`

## Future

- Debounced callbacks
- Throttling
- Cancellable hook
