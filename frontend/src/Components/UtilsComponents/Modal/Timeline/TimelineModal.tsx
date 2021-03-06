import { TimelineModalProps } from '../modalTypes';
import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../../../state/hooks/useForceUpdate';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
	faCircle,
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import { Transition } from '@headlessui/react';
import { classNames } from '../../../../Types/utils';
import { useAlert } from 'react-alert';

function hasMultipleChildren(
	children: React.ReactNode | React.ReactNode[],
): children is Array<JSX.Element> {
	return Array.isArray(children) && children.filter(Boolean).length > 1;
}

/**
 * TimelineModal component for displaying a modal with a timeline
 * @param children - children of the modal
 * @param setOpen - function to set the open state of the modal
 * @param open - boolean to determine if the modal is open
 * @param title - title of the modal
 * @param defaultSlideClassName - default class name for the slide
 * @param size - size of the modal
 * @param onCancel - function to call when the cancel button is clicked
 * @param submitText - text to display on the submit button
 * @param onSubmit - function to call when the submit button is clicked
 * @param submitButtonVariant - variant of the submit button
 * @param modalProps - props to pass to the modal
 * @constructor
 * @author Mathis Laroche
 */
const TimelineModal = ({
	children,
	setOpen,
	open,
	title,
	defaultSlideClassName,
	size = 'md',
	onCancel,
	submitText,
	onSubmit,
	submitButtonVariant = 'secondary',
	...modalProps
}: TimelineModalProps) => {
	const { t } = useTranslation();
	const forceUpdate = useForceUpdate();
	const [currentPage, setCurrentPage] = useState(0);
	const alert = useAlert();

	const numberOfPages = useMemo(
		() => (hasMultipleChildren(children) ? children.length : 1),
		[children],
	);

	useEffect(() => {
		if (!open) {
			onCancel && onCancel();
		}
	}, [onCancel, open]);

	const _getPropertyOfChild = useCallback(
		(property: string) => {
			const _child = Array.isArray(children) ? children[currentPage] : children;
			if (
				!_child ||
				Object.keys(_child).length === 0 ||
				typeof _child !== 'object'
			)
				return true;
			const child = _child as JSX.Element;
			if (!(property in child.props)) return true;
			return child.props[property];
		},
		[children, currentPage],
	);

	const canGoNext = useCallback(() => {
		return !!_getPropertyOfChild('canGoNext');
	}, [_getPropertyOfChild]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const autoNext = useCallback(() => {
		return !!_getPropertyOfChild('autoNext');
	}, [_getPropertyOfChild]);

	const nextPageOrClose = useCallback(() => {
		if (!canGoNext()) return;
		if (currentPage < numberOfPages - 1) {
			setCurrentPage(currentPage + 1);
		} else {
			setOpen(false);
		}
	}, [canGoNext, currentPage, numberOfPages, setOpen]);

	const previousPage = useCallback(() => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	}, [currentPage]);

	// useEffect(() => {
	// 	if (canGoNext() && autoNext() && currentPage < numberOfPages - 1) {
	// 		nextPageOrClose();
	// 	}
	// }, [autoNext, canGoNext, currentPage, nextPageOrClose, numberOfPages]);

	const MultipleSlides = () => {
		return (
			<div className="flex flex-col transition-all">
				{hasMultipleChildren(children) ? (
					children.map((child, index) => {
						return (
							<Transition
								// enter="transition ease-in-out duration-200 transform"
								// enterFrom="translate-x-full"
								// enterTo="translate-x-0"
								// leave="transition ease-in-out duration-200 transform"
								// leaveFrom="translate-x-0"
								// leaveTo="-translate-x-full"
								show={currentPage === index}
								// appear
							>
								<div className={defaultSlideClassName}>{child}</div>
							</Transition>
						);
					})
				) : (
					<Transition show>
						<div className={defaultSlideClassName}>{children}</div>
					</Transition>
				)}
				<div className="flex flex-row justify-evenly align-middle pt-12">
					{hasMultipleChildren(children) && (
						<>
							<button
								className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-40"
								disabled={currentPage === 0}
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
										className={classNames(
											idx === currentPage &&
												'text-[color:var(--foreground-color)]',
											idx !== currentPage &&
												(canGoNext()
													? 'text-[color:var(--fg-shade-three-color)] opacity-50 cursor-pointer'
													: 'text-[color:var(--fg-shade-three-color)] opacity-10 cursor-not-allowed'),
										)}
										onClick={() => {
											if (!canGoNext() && idx > currentPage) return;
											setCurrentPage(idx);
											forceUpdate();
										}}
									/>
								))}
							</div>
						</>
					)}
					{currentPage === numberOfPages - 1 ? (
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto"
							onClick={() => {
								(onSubmit && onSubmit())?.then(r => {
									if (r !== false) {
										nextPageOrClose();
									} else {
										alert.error(t('form.error.cant_submit'));
									}
								});
							}}
						>
							<span
								className={
									submitButtonVariant === 'secondary'
										? 'hover:text-[color:var(--background-color)] text-[color:var(--fourth-color)]' +
										  ' hover:bg-[color:var(--fourth-color)] bg-[color:var(--background-color)]' +
										  ' transition-colors' +
										  ' border-[color:var(--fourth-color)] border rounded-md text-md px-2 mr-4 py-1'
										: 'text-[color:var(--background-color)]' +
										  ' hover:bg-[color:rgb(var(--fourth-color-rgb),0.7)] bg-[color:var(--fourth-color)]' +
										  ' transition-colors' +
										  ' border-[color:var(--fourth-color)] border rounded-md text-md px-2 mr-4 py-1'
								}
							>
								{submitText ?? t('modal.close')}
							</span>
						</button>
					) : (
						<button
							className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
							onClick={nextPageOrClose}
							disabled={!canGoNext()}
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
			onKeyDownEnter={() => {
				console.log(canGoNext());
				canGoNext() && nextPageOrClose();
			}}
			onShow={() => {
				setCurrentPage(0);
				modalProps.onShow && modalProps.onShow();
			}}
			topBar={
				hasMultipleChildren(children) ? (
					<label className={'w-full flex justify-end pr-4 pt-4 absolute'}>
						{currentPage + 1} / {numberOfPages}
					</label>
				) : undefined
			}
			size={size}
			{...modalProps}
		>
			<MultipleSlides />
		</Modal>
	);
};

export default TimelineModal;
