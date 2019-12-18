/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
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

const CancelComponent = ({ callback, cancel = true }) => {
  const [debouncedCallback, cancelCallback] = useDebouncedCallback(callback);
  debouncedCallback();
  if (cancel) cancelCallback();
  return null;
};

jest.useFakeTimers();

describe('Test useDebouncedCallback hook', () => {
  test('Inital value passes', () => {
    const component = create(<TestComponent value="inital" />);
    const instance = component.root;

    expect(instance.findByProps({ className: 'state-value' }).children[0]).toEqual('inital');
  });

  test('State change with default passes', () => {
    const component = create(<TestComponent key="test" value="inital" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('inital');

    component.update(<TestComponent key="test" value="changed" />);
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('changed');
  });

  test('Function should be called once', () => {
    const mockCallback = jest.fn();

    create(<CancelComponent callback={mockCallback} cancel={false} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(1);
  });

  test('Canceling state change passes', () => {
    const mockCallback = jest.fn();

    create(<CancelComponent callback={mockCallback} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockCallback.mock.calls.length).toEqual(0);
  });
});
