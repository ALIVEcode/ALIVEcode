import styled from 'styled-components';
import { GenHyperparameters } from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import { Theme } from '../../../state/contexts/ThemeContext';
import { EditorTabModel } from '../LineInterface/lineInterfaceTypes';

/**
 * This type describes all properties of an AIInterface.
 *
 * @param handleChange a callback function updating the parent component of this AIInterface.
 * @param className the class name of this component.
 * @param tabs the AITabModel objects for this AIInterface
 *
 * @author Félix Jobin
 */
export type AIInterfaceProps = {
	handleHyperparamChange: (newHyperparams: any) => void;
	className?: string;
	tabs: AITabModel[];
	data: any;
	hyperparams: GenHyperparameters;
};

/**
 * This type represents the general properties of an AITab. It is used to
 * keep minimum information on an AITab when passing them as arguments.
 *
 * @param title the tab's title.
 * @param open a boolean telling if the tab is open or closed.
 * @param onChange a callback function called when the tab's state changes.
 *
 * @author Félix Jobin
 */
export type AITabModel = {
	title: string;
	open: boolean;
	onChange?: (content: string) => void;
};

/**
 * This component contains the CSS code related to the AIInterface.
 */
export const StyledAIInterface = styled.div`
	${({ theme }: { theme: Theme }) =>
		theme.name === 'light'
			? 'color: var(--background-color);'
			: 'color: var(--foreground-color)'}

	.bg {
		background-color: var(--background-color);
	}

	.ai-tabs {
		display: flex;
		background-color: var(--background-color);
	}

	.header {
		text-align: center;
		font-size: 25px;
		padding: 10px;
		font-weight: bold;
		color: var(--foreground-color);
	}

	.dropdown-menu {
		display: flex;
		margin-right: 0.5vw;
		color: var(--foreground-color);
	}

	.dropdown {
		font-size: 12px;
		width: 100%;
		justify-content: flex-end;
		background-color: var(--bg-shade-one-color);
	}

	.head-text {
		width: 250px;
		font-size: 14px;
		text-align: right;
		align-items: center;
		margin-right: 0.5vw;
		display: inline-block;
		font-weight: 700;
	}
`;
