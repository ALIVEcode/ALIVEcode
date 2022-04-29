import { TimelinePageProps } from '../modalTypes';

const TimelinePage = ({
	goNextWhen,
	autoNext = false,
	canGoNext = true,
	children,
}: TimelinePageProps) => {
	return <>{children}</>;
};

export default TimelinePage;
