import { CmdProps } from './cmdTypes';
import styled from 'styled-components';
import React, { useContext } from 'react';
import Button from '../../UtilsComponents/Buttons/Button';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import useComplexState from '../../../state/hooks/useComplexState';
import { classNames } from '../../../Types/utils';

const StyledDiv = styled.div`
	background-color: ${({ theme }) =>
		theme.name === 'light'
			? 'var(--bg-shade-two-color)'
			: 'var(--almost-black-color)'};
	border-left: 1px solid var(--bg-shade-three-color);
	color: var(--foreground-color);
	padding: 15px;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	font-family: Arial, Helvetica, sans-serif;
	font-size: large;

	pre {
		font-family: Arial, Helvetica, sans-serif;
		font-size: large;
		color: var(--foreground-color);
		line-height: 2rem;
		word-wrap: break-word;
		max-width: 50px;
	}

	a {
		cursor: pointer;
	}

	.btn-clearCmdLines {
		right: 0;
	}
`;

/**
 * Styled Cmd element used for console logging the alivescript results
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const Cmd = React.forwardRef<HTMLDivElement>((props: CmdProps, ref) => {
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	const [settings, setSettings] = useComplexState({
		softWrap: false,
	});

	return (
		// <StyledDiv theme={theme}>
		<div
			className={classNames(
				'border-l border-[color:var(--bg-shade-three-color)]',
				'text-[color:var(--foreground-color)]',
				'w-full h-full',
				'overflow-y-auto',
				theme.name === 'light'
					? 'bg-[color:var(--bg-shade-two-color)]'
					: 'bg-[color:var(--almost-black-color)]',
			)}
		>
			<div className="flex flex-row gap-2 pt-2 pl-2">
				<Button
					variant="third"
					onClick={() => {
						if (!ref || !('current' in ref) || !ref.current) return;
						ref.current.innerHTML = '';
					}}
					className="btn-clearCmdLines"
				>
					{t('cmd.clear')}
				</Button>
				<Button
					variant="third"
					onClick={() => {
						if (!ref || !('current' in ref) || !ref.current) return;
						settings.softWrap = !settings.softWrap;
						setSettings(settings);
					}}
					className="btn-clearCmdLines"
				>
					{t('cmd.clear')}
				</Button>
			</div>
			<div className="w-full h-[1px] py-1.5 border-b-2 border-[color:var(--bg-shade-one-color)]" />
			<div ref={ref} />
			{/*</StyledDiv>*/}
		</div>
	);
});

export default Cmd;
