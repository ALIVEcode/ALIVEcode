import { ModalProps } from './modalTypes';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classNames } from '../../../Types/utils';
import Button from '../Button/Button';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Component used to show a custom styled modal
 *
 * @param {boolean} open State of the modal
 * @param {any} children Body content of the modal
 * @param {string} title Title shown in the header of the modal
 * @param {callback} onClose Callback called on close
 * Button props
 * @param {string} buttonVariant Show the closeButtons on the top right
 * @param {string} submitText Text of the submit button
 * @param {string} size Size of the modal
 * @param {boolean} closeCross Shows the closeButton on the top right
 * @param {boolean} hideCloseButton Hides the close button in the footer
 * Other
 * @param {boolean} hideFooter
 * @param {boolean} centered Centers the modal at the center of the screen
 * @param {boolean} centeredText Centers the text inside of the modal
 * @returns
 */
const Modal = (props: ModalProps) => {
	const {
		children,
		title,
		open,
		setOpen,
		size = 'sm',
		hideFooter,
		closeCross,
		submitButtonVariant,
		closeButtonVariant,
		submitText,
		closeText,
		hideSubmitButton,
		hideCloseButton,
		centered,
		centeredText,
		backdropClassName,
		contentClassName,
		dialogClassName,
		icon,
		onShow,
	} = props;

	const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (open) onShow && onShow();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-20 inset-0 overflow-y-auto h-full"
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<div
					className={classNames(
						centeredText && 'text-center',
						'flex items-center justify-center min-h-screen p-2 tablet:p-4 laptop:pt-8 desktop:p-10',
					)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay
							className={classNames(
								'fixed inset-0 bg-[color:rgba(var(--bg-shade-three-color-rgb),0.75)] transition-opacity',
								backdropClassName,
							)}
						/>
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div
							className={classNames(
								size === 'sm' && 'w-full phone:2-4/5 tablet:w-1/2 laptop:w-1/3',
								size === 'lg' && 'w-full tablet:w-3/4 desktop:w-3/5',
								size === 'xl' && 'w-full laptop:2/3 desktop:w-4/5',
								'overflow-y-auto inline-block align-bottom rounded-lg overflow-hidden shadow-xl transform transition-all bg-[color:var(--background-color)]',
								dialogClassName,
							)}
						>
							{closeCross && (
								<div
									className="absolute top-2 right-2 w-6 h-6 text-[color:var(--fg-shade-four-color)] cursor-pointer text-center"
									onClick={() => setOpen(false)}
								>
									<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
								</div>
							)}
							<div className="p-4 py-0 tablet:p-5 tablet:py-2 desktop:p-7 desktop:py-4">
								<div className="sm:flex sm:items-start w-full">
									{icon && (
										<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
											<FontAwesomeIcon
												icon={icon}
												className="h-6 w-6 text-red-600"
												aria-hidden="true"
											/>
										</div>
									)}
									<div className={classNames('mt-3 w-full', contentClassName)}>
										<Dialog.Title className="text-lg leading-6 font-medium">
											{title}
										</Dialog.Title>
										<div className="mt-2 border-b border-[color:var(--bg-shade-four-color)]"></div>
										<div
											className={classNames(
												size === 'sm' ? 'my-2' : 'my-4',
												centered && 'flex flex-col justify-center',
											)}
										>
											{children}
										</div>
									</div>
								</div>
							</div>
							{!hideFooter && (
								<div className="text-right bg-[color:var(--bg-shade-one-color)] px-4 py-3">
									{!hideCloseButton && (
										<Button
											type="button"
											variant={closeButtonVariant ?? 'secondary'}
											className={!hideSubmitButton ? 'mr-4' : ''}
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											{closeText ?? 'Close'}
										</Button>
									)}
									{!hideSubmitButton && (
										<Button
											variant={submitButtonVariant ?? 'third'}
											onClick={() => setOpen(false)}
										>
											{submitText ?? 'Submit Changes'}
										</Button>
									)}
								</div>
							)}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Modal;
