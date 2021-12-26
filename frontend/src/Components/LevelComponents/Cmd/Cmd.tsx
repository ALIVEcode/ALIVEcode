import { CmdProps } from './cmdTypes';
import styled from 'styled-components';
import React from 'react';
import Button from '../../UtilsComponents/Button/Button';
import { useTranslation } from 'react-i18next';

const StyledDiv = styled.div`
	background-color: var(--primary-color);
	color: var(--foreground-color);
	padding: 15px;
	width: 100%;
	overflow-y: auto;
	font-family: Arial, Helvetica, sans-serif;
	font-size: large;

	pre {
		font-family: Arial, Helvetica, sans-serif;
		font-size: large;
		color: var(--foreground-color);
		line-height: 2rem;
	}

	a {
		cursor: pointer;
	}
	.btn-clearCmdLines {
		right: 0%;
	}
`;

/**
 * Styled Cmd element used for console logging the alivescript results
 *
 * @author MoSk3
 */
const Cmd = React.forwardRef<HTMLDivElement>((props: CmdProps, ref) => {
	const { t } = useTranslation();

	return (
		<StyledDiv>
			<Button
				variant="primary"
				onClick={() => {
					if (!ref || !('current' in ref) || !ref.current) return;
					ref.current.innerHTML = '';
				}}
				className="btn-clearCmdLines"
			>
				{t('cmd.clear')}
			</Button>
			<div ref={ref}></div>
		</StyledDiv>
	);
});

export default Cmd;