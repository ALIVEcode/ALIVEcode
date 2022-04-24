import { useCallback, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
	faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { InfoSlidesProps } from '../HelpProps';
import Modal from '../../UtilsComponents/Modal/Modal';
import Button from '../../UtilsComponents/Buttons/Button';

const InfoSlides = ({
	children,
	setOpen,
	open,
	title,
	defaultSlideClassName,
	size = 'md',
	...modalProps
}: InfoSlidesProps) => {
	const { t } = useTranslation();
	const forceUpdate = useForceUpdate();

	const numberOfPages = useMemo(
		() => (Array.isArray(children) ? children.length : 0),
		[children],
	);

	const currentPageRef = useRef(0);

	const nextPageOrClose = useCallback(() => {
		if (currentPageRef.current < numberOfPages - 1) {
			currentPageRef.current++;
			forceUpdate();
		} else {
			setOpen(false);
		}
	}, [numberOfPages, forceUpdate, setOpen]);

	const previousPage = useCallback(() => {
		if (currentPageRef.current > 0) {
			currentPageRef.current--;
			forceUpdate();
		}
	}, [forceUpdate]);

	const MultipleSlides = () => {
		if (!Array.isArray(children)) {
			return null;
		}
		return (
			<div className="flex flex-col">
				<div className={defaultSlideClassName}>
					{children[currentPageRef.current]}
				</div>
				<div className="flex flex-row justify-evenly align-middle pt-12">
					<button
						className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
						disabled={currentPageRef.current === 0}
						onClick={previousPage}
					>
						<FontAwesomeIcon size="1x" icon={faChevronLeft} />
						<span>{t('help.slides.previous')}</span>
					</button>
					<div className="flex flex-row gap-4 justify-between py-1 px-2">
						{children.map((child, idx) => (
							<FontAwesomeIcon
								key={idx}
								icon={faCircle}
								size="xs"
								className={`cursor-pointer ${
									idx === currentPageRef.current
										? 'text-[color:var(--fg-shade-three-color)]'
										: 'text-gray-500'
								}`}
								onClick={() => {
									currentPageRef.current = idx;
									forceUpdate();
								}}
							/>
						))}
					</div>
					{currentPageRef.current === numberOfPages - 1 ? (
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
							onClick={nextPageOrClose}
						>
							<span
								className="hover:text-[color:var(--background-color)] text-[color:var(--fourth-color)]
								hover:bg-[color:var(--fourth-color)] bg-[color:var(--background-color)]
								transition-colors
							  border-[color:var(--fourth-color)] border rounded-md text-lg px-1 mr-3"
							>
								{t('modal.close')}
							</span>
						</button>
					) : (
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
							onClick={nextPageOrClose}
						>
							<span>{t('help.slides.next')}</span>
							<FontAwesomeIcon size="1x" icon={faChevronRight} />
						</button>
					)}
				</div>
			</div>
		);
	};

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			hideFooter
			hideSubmitButton
			title={title}
			onShow={() => {
				currentPageRef.current = 0;
				modalProps.onShow && modalProps.onShow();
				forceUpdate();
			}}
			topBar={
				Array.isArray(children) ? (
					<label className={'w-full flex justify-end pr-4 pt-4 absolute'}>
						{currentPageRef.current + 1} / {numberOfPages}
					</label>
				) : undefined
			}
			size={size}
			{...modalProps}
		>
			{Array.isArray(children) ? (
				<MultipleSlides />
			) : (
				<div className={defaultSlideClassName}>{children}</div>
			)}
		</Modal>
	);
};

export default InfoSlides;
