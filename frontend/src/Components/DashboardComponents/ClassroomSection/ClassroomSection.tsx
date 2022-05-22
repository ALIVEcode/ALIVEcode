import { ClassroomSectionProps } from './classroomSectionTypes';
import { useState, useEffect, useRef } from 'react';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import CourseSection from '../CourseSection/CourseSection';
import { formatTooLong } from '../../../Types/formatting';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '../../../state/hooks/useQuery';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../Types/utils';

const ClassroomSection = ({
	classroom,
	onClick,
	selected,
}: ClassroomSectionProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const forceUpdate = useForceUpdate();
	const location = useLocation();
	const navigate = useNavigate();
	const query = useQuery();
	const loaded = useRef<boolean | null>();
	const { t } = useTranslation();

	useEffect(() => {
		setIsOpen(query.get('open')?.includes(classroom.id) ?? false);
	}, [classroom.id, query]);

	useEffect(() => {
		if (isOpen && !classroom.courses && !loaded.current) {
			const loadCourses = async () => {
				loaded.current = true;
				await classroom.getCourses();
				forceUpdate();
			};

			loadCourses();
		}
	}, [classroom, forceUpdate, isOpen]);

	return (
		<>
			<div
				className={'sidebar-classroom ' + (selected ? 'sidebar-selected' : '')}
				onClick={onClick}
			>
				<FontAwesomeIcon
					className="sidebar-icon-right mr-3"
					onClick={e => {
						e.stopPropagation();
						setIsOpen(!isOpen);

						// Update Search query
						if (isOpen) {
							const q = query.get('open');
							if (q) {
								const ids = q.split('_');
								const newQuery = ids
									.filter(id => id !== classroom.id)
									.join('_');
								if (newQuery.length <= 0) query.delete('open');
								else query.set('open', newQuery);
							}
						} else {
							if (query.has('open'))
								query.set('open', query.get('open') + '_' + classroom.id);
							else query.set('open', classroom.id);
						}
						navigate({
							pathname: location.pathname,
							search: query.toString(),
						});
					}}
					icon={isOpen ? faAngleDown : faAngleRight}
				/>
				<FontAwesomeIcon
					className="sidebar-icon"
					icon={classroom.getSubjectIcon()}
				/>
				<label className="sidebar-classroom-text">
					{formatTooLong(classroom.name, 25)}
				</label>
			</div>
			<div
				className={classNames(
					'ml-4 border-l border-[color:var(--bg-shade-four-color)]',
					isOpen && 'mb-2',
					isOpen && selected && 'mt-2',
				)}
			>
				{isOpen &&
					(classroom.courses && classroom.courses?.length > 0 ? (
						classroom.courses.map((course, idx) => (
							<CourseSection key={idx} course={course}></CourseSection>
						))
					) : (
						<div className="sidebar-course">
							<label className="sidebar-course-text no-cursor">
								<i>{t('dashboard.classrooms.no_courses')}</i>
							</label>
						</div>
					))}
			</div>
			<hr />
		</>
	);
};

export default ClassroomSection;
