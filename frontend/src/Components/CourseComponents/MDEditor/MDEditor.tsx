import { Form } from 'react-bootstrap';
import { StyledMDEditor, MDEditorProps } from './mdEditorTypes';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../../UtilsComponents/Button/Button';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';

import 'katex/dist/katex.min.css';
import { remarkAlbum } from './remark-album';
import { rehypeAlbum } from './rehype-album';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import alivescript from '../../ALBUMComponents/ASSyntax';

const MDEditor = ({ onSave, defaultValue }: MDEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);
	const [content, setContent] = useState(defaultValue ?? '');
	useEffect(() => {
		SyntaxHighlighter.registerLanguage('alivescript', alivescript);
	}, []);

	useEffect(() => {
		defaultValue && setContent(defaultValue);
	}, [defaultValue]);

	return (
		<StyledMDEditor>
			<div className="editor-header">
				<div onClick={() => setIsPreview(false)}>Edit</div>
				<div onClick={() => setIsPreview(true)}>Preview</div>
			</div>
			<div className="editor-toolbar">
				<div>Color</div>
				<div>Math</div>
			</div>
			<div className="editor-body">
				{!isPreview ? (
					<Form.Control
						onChange={e => setContent(e.target.value)}
						as="textarea"
						value={content}
					/>
				) : (
					<ReactMarkdown
						remarkPlugins={[
							remarkGfm,
							remarkMath,
							//remarkBreaks,
							//remarkAlbum.asCodeBlock,
						]}
						rehypePlugins={[
							//rehypeAlbum.underline,
							rehypeKatex,
						]}
						components={{
							code({ node, inline, className, children, ...props }) {
								const match = /language-(\w+)/.exec(className || '');
								return !inline && match ? (
									<SyntaxHighlighter
										style={atomDark}
										language={match[1]}
										PreTag="div"
									>
										{String(children).replace(/\n$/, '')}
									</SyntaxHighlighter>
								) : (
									<code className={className} {...props}>
										{children}
									</code>
								);
							},
						}}
					>
						{content}
					</ReactMarkdown>
				)}
			</div>
			<div className="editor-footer">
				<Button onClick={() => onSave && onSave(content)} variant="primary">
					Save
				</Button>
			</div>
		</StyledMDEditor>
	);
};

export default MDEditor;