import { CounterProps } from './counterTypes';
import { useState, useEffect, useRef } from 'react';

const Counter = ({ msg }: CounterProps) => {
	const [count, setCount] = useState(0);

	const inputRef = useRef<any>(null);

	useEffect(() => {
		console.log('');
	});

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Click me</button>
			<br />
			<label>{count}</label>
			<br />
			<button onClick={() => inputRef.current?.focus()}>Click me again</button>
			<input ref={inputRef} />
		</div>
	);
};

export default Counter;
