/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { create, act } from 'react-test-renderer';
import useDebouncedCallback from '../useDebouncedCallback';

const TestComponent = ({ value, delay }) => {
  const [state, setState] = useState(value);
  const [fct] = useDebouncedCallback(() => setState(value, delay));

  useEffect(() => fct(), [value]);

  return (
    <div>
      <span className="state-value">{state}</span>
    </div>
  );
};

const CancelComponent = ({ callback, cancel = true, options = {} }) => {
  const [debouncedCallback, cancelCallback] = useDebouncedCallback(callback, 500, options);
  debouncedCallback();
  if (cancel) cancelCallback();
  return null;
};

jest.useFakeTimers();

describe('Test useDebouncedCallback hook', () => {
  test('initial value passes', () => {
    const component = create(<TestComponent value="initial" />);
    const instance = component.root;

    expect(instance.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');
  });

  test('State change with default passes', () => {
    const component = create(<TestComponent key="test" value="initial" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');

    component.update(<TestComponent key="test" value="changed" />);
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('changed');
  });

  test('Function should be called once', () => {
    const mockCallback = jest.fn();

    const component = create(<CancelComponent callback={mockCallback} cancel={false} />);
    act(() => {
      jest.runAllTimers();
    });

    component.update(<CancelComponent callback={mockCallback} />);
    expect(mockCallback.mock.calls.length).toEqual(1);
  });

  test('Function should be called twice', () => {
    const mockCallback = jest.fn();

    const component = create(<CancelComponent callback={mockCallback} cancel={false} />);
    act(() => {
      jest.runAllTimers();
    });

    component.update(<CancelComponent callback={mockCallback} />);
    act(() => {
      jest.runAllTimers();
    });

    component.update(<CancelComponent callback={mockCallback} cancel={false} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(mockCallback.mock.calls.length).toEqual(2);
  });

  test('Intermediate function calls not triggered', () => {
    const mockCallback = jest.fn();

    const component = create(<CancelComponent callback={() => mockCallback(1)} cancel={false} />);
    act(() => {
      jest.runAllTimers();
    });

    component.update(<CancelComponent callback={() => mockCallback(2)} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(mockCallback).toHaveBeenCalledWith(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('Debounced function is able to be cancelled', () => {
    const mockCallback = jest.fn();

    const component = create(<CancelComponent callback={mockCallback} />);
    component.update(<CancelComponent callback={mockCallback} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(0);
  });
});

describe('Test useDebouncedCallback options', () => {
  test('Default options pass', () => {
    const mockCallback = jest.fn();

    const component = create(<CancelComponent callback={mockCallback} />);
    component.update(<CancelComponent callback={mockCallback} cancel={false} />);
    expect(mockCallback.mock.calls.length).toEqual(0);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(1);
  });

  test('Trailing passes, should be identical to default case', () => {
    const mockCallback = jest.fn();

    const component = create(
      <CancelComponent callback={mockCallback} options={{ trailing: true }} />
    );
    component.update(
      <CancelComponent callback={mockCallback} cancel={false} options={{ trailing: true }} />
    );
    expect(mockCallback.mock.calls.length).toEqual(0);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(1);
  });

  test('Leading passes', () => {
    const mockCallback = jest.fn();

    const component = create(
      <CancelComponent callback={mockCallback} options={{ leading: true, trailing: false }} />
    );
    component.update(
      <CancelComponent
        callback={mockCallback}
        cancel={false}
        options={{ leading: true, trailing: false }}
      />
    );
    expect(mockCallback.mock.calls.length).toEqual(1);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(1);
  });

  test('Leading and trailing passes', () => {
    const mockCallback = jest.fn();

    const component = create(
      <CancelComponent callback={mockCallback} options={{ leading: true }} />
    );
    component.update(
      <CancelComponent callback={mockCallback} cancel={false} options={{ leading: true }} />
    );
    expect(mockCallback.mock.calls.length).toEqual(1);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(2);
  });
});
