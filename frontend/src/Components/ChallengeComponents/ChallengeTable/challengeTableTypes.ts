import styled from 'styled-components';

export interface ChallengeTableProps {
	data: (
		{
			id: number;
			x: number;
			y: number;
		}
		| {}
	)[];
	xData: string;
	yData: string;
}

export const StyledChallengeTable = styled.div`
	tbody {
		font-size: 11px;
		border-style: none;
	}

	table {
		padding: 6px;
		color: var(--foreground-color);
		text-align: center;
		margin-bottom: 0;
	}

	.titles {
		font-size: 13px;
		font-weight: bolder;
		background-color: var(--secondary-color);
		border-style: none;
	}

	.data {
		background-color: var(--tableback-color);
		border-top: 0.1vh solid var(--databack-color);
	}

	.data-number {
		background-color: var(--secondary-color);
		border-top: 0.1vh solid var(--databack-color);
	}

	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
	}
`;
