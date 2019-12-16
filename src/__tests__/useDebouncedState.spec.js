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

jest.useFakeTimers();

describe('Test useDebouncedState hook', () => {
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

  test('State changes multiple times in a row', () => {
    const component = create(<TestComponent key="test" value="inital" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('inital');

    component.update(<TestComponent key="test" value="first" />);
    expect(component.root.findByProps({ className: 'state-value' }).children[0]).toEqual('inital');
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
});
