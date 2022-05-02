import { TimelinePageProps } from '../modalTypes';

/**
 * @description TimelinePage component
 * @param goNextWhen is a boolean that determines when the next button should be enabled
 * @param autoNext is a boolean that will determine if the next button will be automatically clicked
 * @param canGoNext is a boolean that will determine if the next button can be clicked
 * @param children is the content of the page
 * @constructor
 *
 * @author Mathis Laroche
 */
const TimelinePage = ({
	goNextWhen,
	autoNext = false,
	canGoNext = true,
	children,
}: TimelinePageProps) => {
	return <>{children}</>;
};

export default TimelinePage;
