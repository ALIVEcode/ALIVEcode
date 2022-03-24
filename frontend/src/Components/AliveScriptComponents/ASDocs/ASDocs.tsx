import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import mdPath from './asDocs.md';
import styled from 'styled-components';
import rehypeRaw from 'rehype-raw';

const StyledDiv = styled.div`
	padding: 80px;
	background-color: rgba(var(--background-color-rgb), 0.5);
`;

/**
 * Component that shows all of the alivescript documentation
 *
 * @author Ecoral360
 * @author Enric Soldevila
 */
const ASDocs = () => {
	const [text, setText] = useState('');

	useEffect(() => {
		fetch(mdPath)
			.then(res => res.text())
			.then(text => setText(text));
	}, []);

	return (
		<StyledDiv>
			<ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} />
		</StyledDiv>
	);
};

export default ASDocs;
