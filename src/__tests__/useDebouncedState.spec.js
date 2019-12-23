/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { create, act } from 'react-test-renderer';
import useDebouncedState from '../useDebouncedState';

const TestComponent = ({ value, delay = 500 }) => {
  const [state, setState] = useDebouncedState(value, delay);
  useEffect(() => {
    setState(value);
  }, [value]);
  return <div className="state-value">{state}</div>;
};

const CancelComponent = ({ value, delay = 1000, cancel = false }) => {
  const [state, setState, cancelCallback] = useDebouncedState(value, delay);

  useEffect(() => {
    setState(value);
    if (cancel) setTimeout(cancelCallback, 500);
  }, [value]);

  return <div className="state-value">{state}</div>;
};

jest.useFakeTimers();

describe('Test useDebouncedState hook', () => {
  test('Inital value passes', () => {
    const component = create(<TestComponent value="initial" />);
    const instance = component.root;

    expect(instance.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');
  });

  test('State change with default delay passes', () => {
    const component = create(<TestComponent key="test" value="initial" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');

    component.update(<TestComponent key="test" value="changed" />);
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('changed');
  });

  test('State changes multiple times in a row', () => {
    const component = create(<TestComponent key="test" value="initial" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');

    component.update(<TestComponent key="test" value="first" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('initial');
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('first');

    component.update(<TestComponent key="test" value="second" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('first');
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('second');

    component.update(<TestComponent key="test" value="third" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('second');
    act(() => {
      jest.runAllTimers();
    });
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('third');
  });

  test('Able to cancel setState Function', () => {
    const component = create(<CancelComponent key="test" value="start" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('start');

    component.update(<CancelComponent key="test" value="did not cancel" cancel />);
    act(() => {
      jest.runAllTimers();
    });

    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('start');
  });
});
