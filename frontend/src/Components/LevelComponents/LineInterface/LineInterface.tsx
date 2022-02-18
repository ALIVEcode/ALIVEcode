import {
	LineInterfaceProps,
	StyledLineInterface,
	EditorTabModel,
} from './lineInterfaceTypes';
import EditorTab from '../../AliveScriptComponents/EditorTab/EditorTab';
import { useState, useRef, memo, useContext } from 'react';
import { ThemeContext } from '../../../state/contexts/ThemeContext';

import { Autocomplete, setAutocomplete } from './autocomplete/autocomplete';
import ace from 'ace-builds';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import './mode-alivescript';

/**
 * Line interface to write the code on
 *
 * @param {boolean} hasTabs
 * @param {EditorTabModel[]} tabs tabs for the different scripts
 * @param initialContent
 * @param handleChange callback function that takes as parameter the line interface's content (string)
 *
 * @author MoSk3
 */
const LineInterface = memo(
	({
		hasTabs,
		tabs: initialTabs,
		initialContent,
		handleChange,
		className,
	}: LineInterfaceProps) => {
		/* Content for a multiple tabs interface */
		const [tabs, setTabs] = useState<EditorTabModel[]>(() => {
			if (!hasTabs) return [];
			return (
				initialTabs || [
					{
						title: 'New tab',
						open: true,
					},
				]
			);
		});
		/* Content for a single tab interface */
		const [content, setContent] = useState<string>(initialContent ?? '');
		const { theme } = useContext(ThemeContext);

		const ref = useRef<AceEditor | null>(null);
		const refList = useRef<AceEditor[]>([]);

		const setOpenedTab = (idx: number) => {
			const updatedTabs = tabs.map((t, i) => {
				if (i === idx) handleChange(t.content);
				t.open = i === idx;
				return t;
			});
			setTabs(updatedTabs);
		};

		const onEditorChange = (content: string, tab?: EditorTabModel) => {
			tab && tab.onChange && tab.onChange(content);
			handleChange(content);
		};

		return (
			<StyledLineInterface
				theme={theme}
				className={'flex flex-col h-full ' + className}
			>
				{hasTabs && (
					<div className="editors-tab-bg w-100">
						<div className="editors-tab w-100">
							{tabs.map((t, idx) => (
								<EditorTab
									key={idx}
									tab={t}
									setOpen={() => setOpenedTab(idx)}
								/>
							))}
						</div>
					</div>
				)}
				{hasTabs ? (
					<>
						{tabs.map((t, idx) => {
							return (
								<AceEditor
									key={idx}
									ref={el => {
										if (el) refList.current[idx] = el;
									}}
									className={
										'ace-editor relative ' +
										(!t.open && t.loaded ? 'hidden-editor ' : '') +
										(t.open ? 'opened-editor ' : '')
									}
									defaultValue={t.defaultContent}
									value={t.content}
									mode="alivescript"
									theme="cobalt"
									showGutter
									showPrintMargin
									onLoad={() => {
										// To only hide the tab editor once it loaded
										setTimeout(() => {
											// Set default content in parent prop
											if (t.open) handleChange(t.defaultContent);
											tabs[idx].content = t.defaultContent;
											tabs[idx].loaded = true;
											setTabs([...tabs]);
											refList.current.forEach(el => el.editor.resize());
										}, 100);
										const editor = ace.edit('1nt3rf4c3');
										setAutocomplete(editor);
										editor.keyBinding.addKeyboardHandler(new Autocomplete(), 0);
									}}
									onChange={content => {
										onEditorChange(content, t);
										tabs[idx].content = content;
										setTabs([...tabs]);
									}}
									fontSize="large"
									name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
									editorProps={{ $blockScrolling: Infinity }}
									setOptions={{
										enableBasicAutocompletion: true,
										enableSnippets: true,
										enableLiveAutocompletion: true,
										scrollPastEnd: true,
										vScrollBarAlwaysVisible: true,
									}}
								/>
							);
						})}
					</>
				) : (
					<AceEditor
						ref={ref}
						className="ace-editor relative"
						mode="alivescript"
						theme="cobalt"
						defaultValue={initialContent}
						value={content}
						onChange={content => {
							setContent(content);
							onEditorChange(content);
						}}
						onLoad={() => {
							handleChange(initialContent);

							// Resize the ace editor to avoid layout bugs
							setTimeout(() => {
								if (ref.current) {
									ref.current.editor.resize();
									const editor = ace.edit('1nt3rf4c3');
									setAutocomplete(editor);
									editor.keyBinding.addKeyboardHandler(new Autocomplete(), 0);
								}
							}, 10);
						}}
						fontSize="large"
						name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
						editorProps={{ $blockScrolling: true }}
						setOptions={{
							enableBasicAutocompletion: true,
							enableSnippets: true,
							enableLiveAutocompletion: true,
						}}
					/>
				)}
			</StyledLineInterface>
		);
	},
);

export default LineInterface;
