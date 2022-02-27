import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';

/**
 *
 * @param element
 * @returns
 *
 * @author Mathis Laroche
 */
const CourseLayoutElement = ({
	element,
	editMode,
	depth = 0,
}: CourseLayoutElementProps) => {
	// const { loadSectionElements, courseElements } = useContext(CourseContext);

	// useEffect(() => {
	// 	if (!element?.section || !courseElements?.current) return;

	// 	const noReload = element.section.elementsOrder.every(id => {
	// 		return id in courseElements.current;
	// 	});

	// 	if (noReload) return;

	// 	console.log(`reloading section ${element.name}`);
	// 	loadSectionElements(element.section);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [element, courseElements]);

	return (
		<div style={{ marginLeft: `${20 * depth}px` }}>
			{element?.section ? (
				<CourseLayoutSection
					section={element.section}
					editMode={editMode}
					depth={depth}
				/>
			) : element?.activity ? (
				<CourseLayoutActivity />
			) : (
				<div>ERREUR</div>
			)}
		</div>
	);
};

export default CourseLayoutElement;
