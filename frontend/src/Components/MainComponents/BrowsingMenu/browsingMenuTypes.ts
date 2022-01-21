import styled from 'styled-components';

export type BrowsingResults<T> = {
	results: T[];
	nbResults: number;
};

export type BrowsingQuery = {
	txt?: string;
};

export type BrowsingMenuProps<T> = {
	onChange: (arg: BrowsingResults<T>) => void;
	fetchOnSubmit?: boolean;
	apiRequest: (arg: BrowsingQuery) => Promise<T[]>;
};

export const StyledBrowsingMenu = styled.div`
	width: 100%;
	height: auto;
	background-color: var(--primary-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 50px;
`;
