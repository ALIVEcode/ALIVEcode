import { useCallback, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { InfoSlidesProps } from '../HelpProps';
import Modal from '../../UtilsComponents/Modal/Modal';
import InfoSlide from './InfoSlide';

function InfoSlides({
	children,
	setOpen,
	open,
	title,
	size = 'md',
	...modalProps
}: InfoSlidesProps) {
	const { t } = useTranslation();
	const forceUpdate = useForceUpdate();

	const numberOfPages = useMemo(
		() => (Array.isArray(children) ? children.length : 0),
		[children],
	);

	const currentPageRef = useRef(0);

	const nextPage = useCallback(() => {
		if (currentPageRef.current < numberOfPages - 1) {
			currentPageRef.current++;
			forceUpdate();
		}
	}, [numberOfPages, forceUpdate]);

	const previousPage = useCallback(() => {
		if (currentPageRef.current > 0) {
			currentPageRef.current--;
			forceUpdate();
		}
	}, [forceUpdate]);

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			hideFooter
			title={title}
			size={size}
			{...modalProps}
		>
			{Array.isArray(children) ? (
				<>
					{children[currentPageRef.current]}
					<div className="flex flex-row items-center justify-evenly py-12">
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
							disabled={currentPageRef.current === 0}
							onClick={previousPage}
						>
							<FontAwesomeIcon size="1x" icon={faChevronLeft} />
							{t('help.slides.previous')}
						</button>
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
							disabled={currentPageRef.current === numberOfPages - 1}
							onClick={nextPage}
						>
							{t('help.slides.next')}
							<FontAwesomeIcon size="1x" icon={faChevronRight} />
						</button>
					</div>
				</>
			) : (
				<div>{children}</div>
			)}
		</Modal>
	);
}

namespace InfoSlides {
	export const Slide = InfoSlide;
}

export default InfoSlides;
