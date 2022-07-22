import styled from 'styled-components';
import { LinkProps, StyledLinkProps } from './linkTypes';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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
 * @author Enric Soldevila
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
	openInNewTab,
	outsideLink,
	download,
	onClick,
}: LinkProps) => {
	if (to && openInNewTab)
		return (
			<a
				href={to}
				rel="noreferrer"
				target="_blank"
				style={style}
				className={className}
				download={download}
				onClick={onClick}
			>
				<>
					{children}
					<FontAwesomeIcon
						className="ml-1"
						size="sm"
						icon={faExternalLinkAlt}
					/>
				</>
			</a>
		);

	if (to && !outsideLink)
		return (
			<RouterLink
				className={className}
				style={style}
				to={to ?? '#'}
				onClick={onClick}
			>
				{children}
			</RouterLink>
		);

	if (to && !openInNewTab)
		return (
			<a href={to} style={style} className={className} onClick={onClick}>
				{children}
			</a>
		);

	return (
		<label className={className} style={style} onClick={onClick}>
			{children}
		</label>
	);
};

export default styled(Link)`
	color: ${(props: StyledLinkProps) => {
		if (props.dark) return 'var(--contrast-color)';
		if (props.pale) return 'var(--pale-color)';
		else return 'var(--logo-color)';
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
