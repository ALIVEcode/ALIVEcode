import {
	EditorTabModel,
	LineInterfaceProps,
	StyledLineInterface,
} from './lineInterfaceTypes';
import EditorTab from '../../AliveScriptComponents/EditorTab/EditorTab';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import { Autocomplete, setAutocomplete } from './autocomplete/autocomplete';
import ace from 'ace-builds';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import './mode-alivescript';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import Modal from '../../UtilsComponents/Modal/Modal';
import Form from '../../UtilsComponents/Form/Form';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'brace/theme/cobalt';
import 'brace/theme/dracula';
import 'brace/theme/github';
import 'brace/theme/twilight';
import 'brace/theme/solarized_dark';
import 'brace/theme/xcode';
import 'brace/ext/language_tools';
import { SUPPORTED_LANG } from '../../../Models/Challenge/challenge.entity';

enum FontSize {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large',
}

enum Theme {
	COBALT = 'cobalt',
	DRACULA = 'dracula',
	GITHUB = 'github',
	TWILIGHT = 'twilight',
	SOLARIZED_DARK = 'solarized_dark',
	XCODE = 'xcode',
}

enum InterfaceFont {
	FIRA_CODE = "font-['Fira_Code'] [font-variant-ligatures:normal]",
	MONO = 'font-mono',
}

/**
 * Line interface to write the code on
 *
 * @param {boolean} hasTabs
 * @param {EditorTabModel[]} tabs tabs for the different scripts
 * @param initialContent
 * @param handleChange callback function that takes as parameter the line interface's content (string)
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const LineInterface = memo(
	({
		hasTabs,
		tabs: initialTabs,
		initialContent,
		handleChange,
		className,
		lang,
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
		const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
			'medium',
		);
		const [fontFamily, setFontFamily] = useState<InterfaceFont>(
			InterfaceFont.FIRA_CODE,
		);
		const [codeTheme, setCodeTheme] = useState<Theme | undefined>(
			theme.name === 'light' ? Theme.XCODE : Theme.COBALT,
		);
		const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

		const ref = useRef<AceEditor | null>(null);
		const refList = useRef<AceEditor[]>([]);

		const { t } = useTranslation();

		const setOpenedTab = (idx: number) => {
			const updatedTabs = tabs.map((t, i) => {
				if (i === idx) handleChange(t.content);
				t.open = i === idx;
				return t;
			});
			const oldCodeTheme = codeTheme;
			setCodeTheme(undefined);
			setTimeout(() => {
				setCodeTheme(oldCodeTheme);
			}, 10);
			setTabs(updatedTabs);
		};

		const onEditorChange = (content: string, tab?: EditorTabModel) => {
			tab && tab.onChange && tab.onChange(content);
			handleChange(content);
		};

		useEffect(() => {
			setCodeTheme(theme.name === 'light' ? Theme.XCODE : Theme.COBALT);
		}, [theme]);

		/*
		useEffect(() => {
			(async () => {
				// setLoaded(false);
				try {
					const lintInfo = await api.as.getLintInfo(lang);
					setLintInfo(lintInfo);
					if (loaded) {
						setReloadRequired(true);
					}
				} catch {
					setLintInfo(null);
				} finally {
					setLoaded(true);
				}
			})();
		}, [lang]);
		*/
		return (
			<StyledLineInterface
				theme={theme}
				className={'flex flex-col border-b h-full ' + className}
			>
				<div className="editors-tab-bg w-full">
					<div className="editors-tab w-full">
						{hasTabs &&
							tabs.map((t, idx) => (
								<div className="w-fit" key={idx}>
									<EditorTab
										key={idx}
										tab={t}
										setOpen={() => setOpenedTab(idx)}
									/>
								</div>
							))}
						<div className="w-full flex justify-end">
							<IconButton
								onClick={() => setSettingsOpen(true)}
								icon={faCog}
								size="2x"
							/>
						</div>
					</div>
				</div>
				{hasTabs ? (
					<>
						{tabs.map((t, idx) => {
							return (
								<AceEditor
									onInput={(event: KeyboardEvent) => {
										if (event.key === 'Escape') {
											event.preventDefault();
										}
									}}
									key={idx}
									ref={el => {
										if (el) refList.current[idx] = el;
									}}
									className={
										'ace-editor relative ' +
										(!t.open && t.loaded ? 'hidden-editor ' : '') +
										(t.open ? 'opened-editor ' : '') +
										' ' +
										fontFamily
									}
									defaultValue={t.defaultContent}
									value={t.content}
									mode={
										lang === SUPPORTED_LANG.EN
											? 'alivescript_en'
											: 'alivescript_fr'
									}
									theme={codeTheme}
									showGutter
									showPrintMargin
									onLoad={async () => {
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
										setAutocomplete(editor, lang);
										editor.keyBinding.addKeyboardHandler(new Autocomplete(), 0);
									}}
									onChange={content => {
										onEditorChange(content, t);
										tabs[idx].content = content;
										setTabs([...tabs]);
									}}
									fontSize={fontSize}
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
						onInput={(event: KeyboardEvent) => {
							if (event.key === 'Escape') {
								event.preventDefault();
							}
						}}
						className={'ace-editor relative ' + fontFamily}
						mode="alivescript"
						theme={codeTheme}
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
									setAutocomplete(editor, lang);
									editor.keyBinding.addKeyboardHandler(new Autocomplete(), 0);
								}
							}, 10);
						}}
						fontSize={fontSize}
						name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
						editorProps={{ $blockScrolling: true }}
						setOptions={{
							enableBasicAutocompletion: true,
							enableSnippets: true,
							enableLiveAutocompletion: true,
						}}
					/>
				)}
				<Modal open={settingsOpen} setOpen={setSettingsOpen} hideFooter>
					<Form
						action={FORM_ACTION.PATCH}
						name={t('form.challenge.PATCH.interface_settings')}
						url=""
						inputGroups={[
							{
								name: 'fontSize',
								inputType: 'select',
								default: fontSize,
								required: true,
								selectOptions: FontSize,
							},
							{
								name: 'fontFamily',
								inputType: 'select',
								default: fontFamily,
								required: true,
								selectOptions: InterfaceFont,
							},
							{
								name: 'codeTheme',
								inputType: 'select',
								default: codeTheme,
								required: true,
								selectOptions: Theme,
							},
						]}
						customSubmit={value => {
							setSettingsOpen(false);
							setFontSize(value.fontSize);
							setFontFamily(value.fontFamily);
							setCodeTheme(value.codeTheme);
						}}
					/>
				</Modal>
			</StyledLineInterface>
		);
	},
);

export default LineInterface;
