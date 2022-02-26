import { CounterProps } from './counterTypes';
import { useState, useEffect, useRef } from 'react';

const Counter = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Click me</button>
			<br />
			<label>{count}</label>
		</div>
	);
};

export default Counter;

const myTSX = (
	<div>
		<h1>Hello World!</h1>
		<p>This is a paragraph</p>
	</div>
);

const name = 'Alexandre';
const myTSX2 = (
	<div>
		{name}
		{myTSX}
	</div>
);

<div>
	Alexandre
	<div>
		<h1>Hello World</h1>
		<p>This is a paragraph</p>
	</div>
</div>;

console.log(myTSX2);

const MonComposantReact = () => {
	return myTSX;
};

// OU

function MonComposantReact2() {
	return myTSX;
}

const monTSX3 = MonComposantReact();
const monTSX4 = <MonComposantReact></MonComposantReact>;
const monTSX5 = <MonComposantReact />;

console.log(monTSX3);
console.log(monTSX4);
console.log(monTSX5);
