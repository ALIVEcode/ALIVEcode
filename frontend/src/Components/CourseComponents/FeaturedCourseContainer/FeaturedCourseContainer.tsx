import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FeaturedCourseContainerProps } from './featuredCourseContainerTypes';
import {
	faArrowRight,
	faTimes,
	faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Link from '../../UtilsComponents/Link/Link';
import CourseCard from '../CourseCard/CourseCard';
import { classNames } from '../../../Types/utils';
import api from '../../../Models/api';
import { useEffect, useRef, useState } from 'react';
import { Course } from '../../../Models/Course/course.entity';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import Carousel from 'react-elastic-carousel';
import useView from '../../../state/hooks/useView';

const FeaturedCourseContainer = ({
	title,
	featuring,
	featuringFrom,
	dark,
	className,
	dismiss,
	link,
	...props
}: FeaturedCourseContainerProps) => {
	const [fetchedCourses, setFetchedCourses] = useState<Course[]>();
	const carouselRef = useRef<Carousel>(null);
	const view = useView();

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

	const getNbItemsInCarousel = () => {
		switch (view.screenType) {
			case 'desktop':
				return 5;
			case 'laptop':
				return 4;
			case 'tablet':
				return 3;
			case 'phone':
				return 1;
		}
	};

	return (
		<div
			className={classNames(
				'rounded-lg border border-[color:var(--bg-shade-four-color)] w-full overflow-x-auto',
				dark ? 'bg-[color:#242424]' : 'bg-[color:var(--background-color)]',
				className,
			)}
		>
			<div className="flex p-4 justify-between border-b border-[color:var(--bg-shade-four-color)]">
				<div>{title}</div>
				<div className="flex flex-row items-center gap-4">
					{link && <Link to={link.to}>{link.title}</Link>}
					{dismiss && link && (
						<div>
							<div className="inline border-r-2 border-[color:var(--fg-shade-four-color)]"></div>
						</div>
					)}
					{dismiss && <FontAwesomeIcon icon={faTimes} />}
				</div>
			</div>
			<div className="p-4">
				{courses ? (
					<Carousel
						ref={carouselRef}
						itemsToShow={getNbItemsInCarousel()}
						itemsToScroll={getNbItemsInCarousel()}
						isRTL={false}
						pagination={false}
						renderArrow={(props: any) =>
							props.type === 'NEXT' ? (
								<div
									className={classNames(
										'h-full flex items-center',
										dark
											? props.isEdge
												? 'text-gray-500 cursor-not-allowed'
												: 'text-white cursor-pointer'
											: props.isEdge
											? 'text-[color:var(--fg-shade-four-color)] cursor-not-allowed'
											: 'text-[color:var(--foreground-color)] cursor-pointer',
									)}
									onClick={() =>
										!props.isEdge && (carouselRef.current as any).slideNext()
									}
								>
									<FontAwesomeIcon icon={faArrowRight} />
								</div>
							) : (
								<div
									className={classNames(
										'h-full flex items-center',
										dark
											? props.isEdge
												? 'text-gray-500 cursor-not-allowed'
												: 'text-white cursor-pointer'
											: props.isEdge
											? 'text-[color:var(--fg-shade-four-color)] cursor-not-allowed'
											: 'text-[color:var(--foreground-color)] cursor-pointer',
									)}
									onClick={() =>
										!props.isEdge && (carouselRef.current as any).slidePrev()
									}
								>
									<FontAwesomeIcon icon={faArrowLeft} />
								</div>
							)
						}
					>
						{courses.map((c, idx) => (
							<CourseCard course={c} key={idx} />
						))}
					</Carousel>
				) : (
					<LoadingScreen relative></LoadingScreen>
				)}
			</div>
		</div>
	);
};

export default FeaturedCourseContainer;
