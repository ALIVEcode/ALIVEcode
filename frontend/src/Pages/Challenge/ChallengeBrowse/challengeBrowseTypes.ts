import styled from 'styled-components';
export type ChallengeBrowseProps = {};

export const StyledChallengeBrowse = styled.div`
	width: 100%;
	position: relative;

	.challenges {
		position: relative;
		width: 100%;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		background-color: var(--bg-shade-one-color);

		// phone
		padding: 1rem;

		// tablet
		@media (min-width: 640px) {
			padding: 2rem;
		}

		// laptop
		@media (min-width: 1024px) {
			padding: 3rem;
		}

		// desktop
		@media (min-width: 1280px) {
			padding: 3.5rem;
		}
	}
`;
