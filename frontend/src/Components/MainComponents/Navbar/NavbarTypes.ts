import { Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import { Theme } from '../../../state/contexts/ThemeContext';
export type NavbarProps = {
	handleLogout: () => void;
};

export const StyledNavbar = styled(Navbar)`
	z-index: 10;
	width: 100%;
	background-color: var(--background-color);
	border-bottom: var(--bg-shade-four-color) 1px solid;
	padding: 0.2rem 0.6rem !important;

	.dropdown-toggle::after {
		display: none !important;
	}

	#user {
		height: 40px;
		width: 40px;
		cursor: pointer;
		margin-right: 10px;
	}

	.btn:focus,
	.btn:active {
		outline: none !important;
		box-shadow: none !important;
	}

	#user svg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		-webkit-transition: all 0.2s linear;
		-o-transition: all 0.2s linear;
		transition: all 0.2s linear;
	}

	#userDropDown a {
		color: var(--foreground-color);
		background-color: var(--background-color);
	}

	#userDropDown a:hover {
		color: rgb(0, 140, 255);
	}

	#user svg:hover {
		stroke: #00a2ff;
	}

	#navbarNavDropdown li {
		margin-right: 10px;
	}

	#navbarNavDropdown ul li:hover {
		border-color: rgb(4, 175, 255);
	}

	#navbarNavDropdown a {
		color: var(--foreground-color);
		-webkit-transition: all 0.2s linear;
		-o-transition: all 0.2s linear;
		transition: all 0.2s linear;
	}

	#navbarNavDropdown a:hover {
		color: rgb(0, 140, 255);
	}

	.nav-link {
		margin-bottom: 0;
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? 'color: var(--dark-gray-color) !important;'
				: 'color: var(--foreground-color) !important;'}
		font-size: 15px;
		padding: 8px 10px 8px 10px !important;
		font-style: normal;
		font-weight: 400;
		line-height: 23px;
		letter-spacing: 0.03em;
		text-align: left;
		font-family: var(--oxygen-font);
		transition: 0.2s;
		font-weight: 400;
	}

	.nav-link:hover {
		color: rgba(var(--foreground-color), 0.75) !important;
	}

	@media (max-width: 1199px) {
		#userDropDown {
			margin-top: 30px;
		}
	}
`;