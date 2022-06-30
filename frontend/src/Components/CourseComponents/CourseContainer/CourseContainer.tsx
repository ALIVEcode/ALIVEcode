import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CourseContainerProps } from './courseContainerTypes';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from '../../UtilsComponents/Link/Link';
import CourseCard from '../CourseCard/CourseCard';
import { classNames } from '../../../Types/utils';
import api from '../../../Models/api';
import { useEffect, useState } from 'react';
import { Course } from '../../../Models/Course/course.entity';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

const CourseContainer = ({
	title,
	featuring,
	featuringFrom,
	dark,
	className,
	...props
}: CourseContainerProps) => {
	const [fetchedCourses, setFetchedCourses] = useState<Course[]>();

	useEffect(() => {
		if (props.courses || !featuringFrom) return;
		const getCourses = async () => {
			const courses = await api.db.courses.getFeaturing({
				featuring,
				featuringFrom,
			});
			setFetchedCourses(courses);
		};
		getCourses();
	}, [featuring, featuringFrom, props.courses]);

	const courses = props.courses ?? fetchedCourses;

	return (
		<div
			className={classNames(
				'rounded-xl p-4 border border-[color:var(--bg-shade-four-color)] w-full overflow-x-auto',
				dark ? 'bg-[color:#242424]' : 'bg-[color:var(--background-color)]',
				className,
			)}
		>
			<div className="flex justify-between mb-2">
				<div className="text-lg">{title}</div>
				<div className="flex flex-row items-center gap-4">
					<Link>See all</Link>
					<div>
						<div className="inline border-r-2 border-[color:var(--fg-shade-four-color)]"></div>
					</div>
					<FontAwesomeIcon icon={faTimes} />
				</div>
			</div>
			<div className="p-2 flex w-full overflow-x-auto">
				{courses ? (
					courses.map((c, idx) => (
						<CourseCard className="!mr-4" course={c} key={idx} />
					))
				) : (
					<LoadingScreen></LoadingScreen>
				)}
			</div>
		</div>
	);
};

export default CourseContainer;
