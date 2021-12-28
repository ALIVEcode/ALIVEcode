import styled from 'styled-components';

export const StyledDashboardRecent = styled.div`
	& .container-fluid {
		padding: 0;
	}

	.container-1 {
		height: 60%;
	}

	.container-2 {
		height: 40%;
	}

	.col {
		padding: 20px;
	}

	.section-recents {
		border-bottom: 1px solid var(--bg-shade-four-color);
	}

	.section-levels {
		border-right: 1px solid var(--bg-shade-four-color);
	}

	.underline {
		border-bottom: 1px solid var(--bg-shade-four-color);
		width: 30%;
	}
`;