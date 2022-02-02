import { TypeWriterProps } from './typeWriterTypes';
import { useState, useEffect } from 'react';

/**
 * Component to simply do a typewriting effect
 *
 * @param {string[]} lines lines to be written
 * @param {number} typeSpeed typeSpeed (interval delay in ms)
 * @param {boolean} noErase if the line should be erased after it was written
 * @param {number} delayAfterWrite pause time before erasing the word (timeout delay in ms)
 * @param {number} delayAfterErase pause time before writing the new word (timeout delay in ms)
 * @param {boolean} shadow if it should have a shadow effect
 *
 * @author MoSk3
 */
const TypeWriter = ({
	lines,
	noErase,
	typeSpeed: typeSpeedProp,
	eraseSpeed: eraseSpeedProp,
	delayAfterWrite,
	delayAfterErase,
	shadow,
	startWithText,
	typeTime,
	eraseTime,
}: TypeWriterProps) => {
	const [lineIndex, setLineIndex] = useState(0);
	const [letterIndex, setLetterIndex] = useState(
		!startWithText ? 0 : lines[0].length,
	);
	const [reverse, setReverse] = useState<boolean>();
	const [blinking, setBlinking] = useState(true);

	const shadowStyle = shadow ? { textShadow: 'var(--drop-shadow)' } : {};

	useEffect(() => {
		const currentLine = lines[lineIndex];

		const eraseSpeed = eraseTime
			? eraseTime / currentLine.length
			: eraseSpeedProp;
		const typeSpeed = typeTime ? typeTime / currentLine.length : typeSpeedProp;

		if (!reverse && letterIndex === currentLine.length) {
			if (!noErase) setReverse(true);
			return;
		}

		if (reverse && letterIndex === 0) {
			setLineIndex(idx => (idx + 1 < lines.length ? idx + 1 : 0));
			setReverse(!reverse);
			return;
		}

		const typeTimeout = setTimeout(
			() => {
				setLetterIndex(letterIndex + (reverse ? -1 : 1));
			},
			letterIndex === currentLine.length || letterIndex === 0
				? reverse
					? delayAfterWrite ?? 2000
					: delayAfterErase ?? 2000
				: reverse
				? eraseSpeed ?? 30
				: typeSpeed ?? 50,
		);

		return () => {
			clearTimeout(typeTimeout);
		};
	}, [
		letterIndex,
		lineIndex,
		typeSpeedProp,
		lines,
		reverse,
		delayAfterWrite,
		delayAfterErase,
		eraseSpeedProp,
		noErase,
		eraseTime,
		typeTime,
	]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setBlinking(state => !state);
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	}, [blinking]);

	return (
		<label>
			<span style={{ display: 'inline', ...shadowStyle }}>
				{lines[lineIndex].substring(0, letterIndex)}
			</span>
			<span
				style={{
					opacity: blinking ? '1' : '0',
					...shadowStyle,
				}}
			>
				|
			</span>
		</label>
	);
};

export default TypeWriter;
