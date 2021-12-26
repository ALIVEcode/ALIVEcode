import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OptionProps, StyledPopup, TDOptionProps } from './tdoptionType';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'reactjs-popup';
import { Card } from 'react-bootstrap';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import InfoBox from '../../ALIVEIAComponents/InfoBox/InfoBox';
import CardContainer from '../CardContainer/CardContainer';

export const TDOption = ({ children, color, ...other }: TDOptionProps) => {
	// <p style={{ margin: '2px', marginRight: '5px', cursor: 'pointer' }}>
	// 	{props.children}
	// </p>

	return (
		<Popup
			trigger={
				<div
					style={{
						backgroundColor: 'var(--contrast-color)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '10px',
					}}
				>
					<FontAwesomeIcon
						icon={faEllipsisH}
						color={color}
						onMouseEnter={() => {}}
					/>
				</div>
			}
			position="right center"
			closeOnDocumentClick
			mouseLeaveDelay={300}
			mouseEnterDelay={0}
			closeOnEscape
			contentStyle={{
				width: '200px',
				display: 'flex',
				flexDirection: 'column',
				background: 'var(--third-color)',
				borderRadius: '10px',
				padding: '10px',
			}}
			arrowStyle={{ color: 'var(--third-color)' }}
		>
			{(Array.isArray(children) ? children : [children]).map(child => (
				<StyledPopup hoverColor={child.props.hoverColor}>{child}</StyledPopup>
			))}
		</Popup>
	);
};

export const Option = ({ name, icon, onClick, toolTipText }: OptionProps) => {
	return (
		<div className="menu-item" onClick={onClick}>
			<div>
				<FontAwesomeIcon icon={icon} />
				<span> {name}</span>
			</div>
		</div>
	);
};
