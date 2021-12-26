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
const TypeWriter = ({ lines, typeSpeed, noErase, eraseSpeed, delayAfterWrite, delayAfterErase, shadow }: TypeWriterProps) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blinking, setBlinking] = useState(true);

  const shadowStyle = shadow ? {textShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)'} : {};

  useEffect(() => {
    const currentLine = lines[lineIndex];

    if(!reverse && letterIndex === currentLine.length + 1) {
      if(!noErase) setReverse(true);
      return;
    }

    if (reverse && letterIndex === 0) {
      setLineIndex(idx => (idx + 1 < lines.length) ? idx + 1 : 0);
      setReverse(!reverse);
      return;
    }

    const typeTimeout = setTimeout(() => {
      setLetterIndex(letterIndex + (reverse ? -1 : 1));
    }, letterIndex === currentLine.length || letterIndex === 0 ? (reverse ? (delayAfterErase || 2000) : (delayAfterWrite || 2000)) : (reverse ? (eraseSpeed || 30) : (typeSpeed || 50)));

    return () => {
      clearTimeout(typeTimeout);
    }
  }, [letterIndex, lineIndex, typeSpeed, lines, reverse, delayAfterWrite, delayAfterErase, eraseSpeed, noErase]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlinking(state => !state);
    }, 500);

    return () => {
      clearTimeout(timeout);
    }
  }, [blinking]);

  return (
    <div>
      <p style={{display: 'inline', ...shadowStyle}}>{lines[lineIndex].substring(0, letterIndex)}</p>
      <div style={{display: 'inline', opacity: blinking ? '1' : '0', ...shadowStyle}}>|</div>
    </div>
  );
}

export default TypeWriter;