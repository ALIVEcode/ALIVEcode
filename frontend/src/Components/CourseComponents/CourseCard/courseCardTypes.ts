import { Course } from '../../../Models/Course/course.entity';
import styled from 'styled-components';
import CourseCardImage from '../../../assets/images/bg/courseCardBg.png';

export type CourseCardProps = {
	course: Course;
};

export const StyledCourseCard = styled.div`
	box-sizing: border-box;
	width: 180px;
	height: 145px;
	background-color: var(--background-color);
	border: 1px solid var(--bg-shade-four-color);
	border-radius: 10px;
	margin-left: auto;
	margin-right: auto;
	cursor: pointer;

	.top-card {
		width: 100%;
		height: 95px;
		position: relative;
		background-image: url(${CourseCardImage});
		background-size: contain;
		//background: linear-gradient(118.46deg, #3fdfff 0%, #1e6aff 100%);
		border-radius: inherit;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		padding: 10px;
	}

	.bottom-card {
		font-size: 0.8em;
		height: 50px;
		padding: 5px 10px 5px 10px;
	}
`;