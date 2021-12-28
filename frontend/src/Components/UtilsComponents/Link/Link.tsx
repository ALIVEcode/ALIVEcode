import styled from 'styled-components';
import { LinkProps, StyledLinkProps } from './linkTypes';
import { useNavigate } from 'react-router-dom';

/**
 * Link component with different variants
 *
 * @param {string} to url that it should redirects to
 * @param {() => any} onClick callback function called when the link is clicked
 * @param {boolean} dark if the link should be more dark
 * @param {boolean} pale if the link should be more pale
 * @param {boolean} bold if the link should be bold
 * @param {boolean} block if the link should be displayed as a block element
 * @param {any} style react styling properties
 * @param {string} className classNames
 * @param {any} children
 *
 * @author MoSk3
 */
const Link = ({
	to,
	className,
	children,
	style,
	dark,
	bold,
	block,
	pale,
	onClick,
}: LinkProps) => {
	const navigate = useNavigate();

	return (
		<label
			className={className}
			style={style}
			onClick={() => {
				if (onClick) onClick();
				else if (to) navigate(to);
			}}
		>
			{children}
		</label>
	);
};

export default styled(Link)`
	color: ${(props: StyledLinkProps) => {
		if (props.dark) return 'var(--contrast-color)';
		if (props.pale) return 'var(--pale-color)';
		else return 'var(--primary-color)';
	}};
	transition: 0.3s;
	cursor: pointer;
	font-weight: ${(props: StyledLinkProps) => (props.bold ? 'bold' : '')};
	display: ${(props: StyledLinkProps) => (props.block ? 'block' : 'inline')};

	&:hover {
		color: #0059ac;
		text-decoration-line: underline;
	}
`;