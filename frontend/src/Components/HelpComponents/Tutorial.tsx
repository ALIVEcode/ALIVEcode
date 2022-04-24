import { TutorialPageProps, TutorialTimelineProps } from './HelpProps';
import Modal from '../UtilsComponents/Modal/Modal';
import { useMemo } from 'react';

namespace Tutorial {
	export const Page = ({ title }: TutorialPageProps) => {
		return <div>{title}</div>;
	};

	export const Timeline = ({ children, ...props }: TutorialTimelineProps) => {
		const numberOfPages = useMemo(() => {
			console.log(children);
			if (Array.isArray(children)) return children.filter(child => true).length;
			else return 1;
		}, [children]);

		return (
			<Modal {...props}>
				<div>{children}</div>
			</Modal>
		);
	};
}

export default Tutorial;
