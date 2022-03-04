import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Link from '../../UtilsComponents/Link/Link';
import { ButtonAddCourseElementProps } from './courseLayoutTypes';

const ButtonAddCourseElement = ({ section }: ButtonAddCourseElementProps) => {
	const { openActivityForm, openSectionForm } = useContext(CourseContext);
	const { t } = useTranslation();
	const [popupOpen, setPopupOpen] = useState(false);
	return (
		<Popup
			trigger={
				<div
					className="border p-2 border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] mt-2 border-opacity-25 w-24 hover:cursor-pointer"
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<FontAwesomeIcon
						icon={faPlus}
						className="[color:var(--contrast-color)]"
						onMouseEnter={() => {}}
					/>
				</div>
			}
			position="top center"
			closeOnDocumentClick
			onOpen={_ => setPopupOpen(true)}
			open={popupOpen}
			closeOnEscape
			contentStyle={{
				width: '200px',
				display: 'flex',
				flexDirection: 'column',
				background: 'var(--background-color)',
				border: 'solid 3px',
				borderColor: 'var(--bg-shade-four-color)',
				borderRadius: '10px',
				padding: '10px',
			}}
			arrowStyle={{
				color: 'var(--bg-shade-four-color)',
				bottom: '2px',
			}}
		>
			<div className="text-[color:var(--foreground-color)] text-center">
				<Link
					dark
					onClick={() => {
						openSectionForm(section);
						setPopupOpen(false);
					}}
				>
					{t('course.section.new')}
				</Link>
				<Link
					onClick={() => {
						openActivityForm(section);
						setPopupOpen(false);
					}}
					dark
					block
				>
					{t('course.activity.new')}
				</Link>
			</div>
		</Popup>
	);
};

export default ButtonAddCourseElement;
