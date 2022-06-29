import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CourseContainerProps } from './courseContainerTypes';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from '../../UtilsComponents/Link/Link';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import CourseCard from '../CourseCard/CourseCard';
import { classNames } from '../../../Types/utils';
const CourseContainer = ({
	title,
	courses,
	featuring,
	featuringFrom,
	dark,
	className,
}: CourseContainerProps) => {
	const { user } = useContext(UserContext);

	useEffect(() => {
		const getCourses = async () => {
			await user?.getCourses();
		};
		getCourses();
	}, []);

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
				{user?.courses?.map((c, idx) => (
					<CourseCard className="!mr-4" course={c} key={idx} />
				))}
			</div>
		</div>
	);
};

export default CourseContainer;
