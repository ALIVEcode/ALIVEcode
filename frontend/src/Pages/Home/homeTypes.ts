import styled from 'styled-components';
export type HomeProps = {};

export const StyledHome = styled.div`
	label {
		margin-bottom: 0;
	}
	.header-circle {
		background: rgba(var(--secondary-color-rgb), 0.64);
		z-index: 0;
	}
	.header {
		background: var(--primary-color);
		color: white;
		height: 450px;
	}
	.header-alive {
		font-family: var(--title-font);
		font-style: normal;
		font-weight: 700;
		text-shadow: var(--drop-shadow);
		letter-spacing: 0.05em;
	}
	.header-desc {
		font-family: var(--title-font);
		font-style: normal;
		font-weight: 700;
		text-shadow: var(--drop-shadow);
		letter-spacing: 0.105em;
		margin-left: 10px;
	}
	.header-lore {
		position: relative;
		font-family: var(--title-font);
		text-shadow: var(--drop-shadow);
		font-style: normal;
		font-weight: normal;
		line-height: 35px;
	}
	#cursor {
		position: absolute;
	}
	#divider {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
	}
	.curve {
		width: 100%;
	}
`;
