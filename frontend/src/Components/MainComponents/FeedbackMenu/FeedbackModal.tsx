import {
	CollectedInformationType,
	FeedbackModalProps,
} from './feedbackModalTypes';
import Button from '../../UtilsComponents/Buttons/Button';
import {
	faBug,
	faFrown,
	faLightbulb,
	faSmile,
} from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { FeedBackTypes } from '../../../Models/Feedbacks/entities/feedback.entity';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { classNames } from '../../../Types/utils';
import { Popup } from 'reactjs-popup';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../../../Models/api';
import Modal from '../../UtilsComponents/Modal/Modal';

const FeedbackModal = ({
	isOpen,
	setIsOpen,
	onSuccess,
	onFailure,
}: FeedbackModalProps) => {
	const [feedbackType, setFeedbackType] = useState<FeedBackTypes>();

	const feedbackTypeMatches = (type: FeedBackTypes) => {
		return feedbackType === undefined || feedbackType === type;
	};

	const [addCollectedInformation, setAddCollectedInformation] = useState(true);
	const checkboxRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [error, setError] = useState<'category' | 'empty-text'>();

	const { theme } = useContext(ThemeContext);

	const { t } = useTranslation();

	const infoToCollect: CollectedInformationType = useMemo(() => {
		return {
			url: {
				description: 'The url of the page you are on right now',
				getIt: () => {
					return window.location.href;
				},
			},
			browser: {
				description: 'The browser you are using',
				getIt: () => {
					/**
					 * @link https://codepedia.info/detect-browser-in-javascript
					 */
					let userAgent = navigator.userAgent;
					let browserName: string;

					if (userAgent.match(/chrome|chromium|crios/i)) {
						browserName = 'chrome';
					} else if (userAgent.match(/firefox|fxios/i)) {
						browserName = 'firefox';
					} else if (userAgent.match(/safari/i)) {
						browserName = 'safari';
					} else if (userAgent.match(/opr\//i)) {
						browserName = 'opera';
					} else if (userAgent.match(/edg/i)) {
						browserName = 'edge';
					} else {
						browserName = 'No browser detection';
					}
					return browserName;
				},
			},
			theme: {
				description: 'The theme (dark/light mode)',
				getIt: () => {
					return theme.name;
				},
			},
			language: {
				description: 'Your language setting',
				getIt: () => {
					return t('lang');
				},
			},
		};
	}, []);

	const InformationPopup = () => {
		return (
			<Popup
				on={'hover'}
				mouseEnterDelay={400}
				mouseLeaveDelay={150}
				trigger={
					<span className="text-blue-400 underline cursor-pointer">
						informations
					</span>
				}
				arrowStyle={{
					color: 'var(--fg-shade-four-color)',
				}}
				repositionOnResize
				position={'top center'}
			>
				<div className="p-3 px-5 bg-[color:var(--background-color)] border border-[color:var(--fg-shade-four-color)]">
					<ul className="list-disc pl-4 text-sm">
						{Object.values(infoToCollect).map((value, idx) => {
							return (
								<li className="py-0.5" key={idx}>
									{value.description}
								</li>
							);
						})}
					</ul>
				</div>
			</Popup>
		);
	};

	const handleSubmit = async () => {
		if (feedbackType === undefined) {
			setError('category');
			return;
		}
		if (!textareaRef.current || textareaRef.current.value === '') {
			setError('empty-text');
			return;
		}
		let feedback;
		if (checkboxRef.current?.checked) {
			const collectedInformation = Object.fromEntries(
				Object.entries(infoToCollect).map(([name, { getIt }]) => {
					return [name, getIt()];
				}),
			);
			feedback = {
				feedbackType: feedbackType,
				...collectedInformation,
				feedbackMessage: textareaRef.current.value,
			};
		} else {
			feedback = {
				feedbackType: feedbackType,
				feedbackMessage: textareaRef.current.value,
			};
		}
		try {
			await api.db.feedback.create(feedback);
			onSuccess && onSuccess();
		} catch {
			onFailure && onFailure();
		}
		setIsOpen(false);
	};

	const ChoiceButton = ({
		color,
		hoverColor,
		unselectedColor = 'bg-gray-400',
		feedbackType,
		message,
		icon,
	}: {
		hoverColor: string;
		color: string;
		unselectedColor?: string;
		feedbackType: FeedBackTypes;
		message: string;
		icon: IconProp;
	}) => {
		return (
			<Button
				variant="primary"
				noHoverColor
				icon={icon}
				className={classNames(
					`hover:${hoverColor}`,
					feedbackTypeMatches(feedbackType) ? color : unselectedColor,
					'px-1.5 mx-1.5',
				)}
				onClick={() => {
					setFeedbackType(feedbackType);
					if (error === 'category') {
						setError(undefined);
					}
				}}
			>
				{message}
			</Button>
		);
	};

	return (
		<Modal
			open={isOpen}
			setOpen={setIsOpen}
			size="md"
			title="What's on your mind?"
			onShow={() => {
				setFeedbackType(undefined);
				setError(undefined);
			}}
			hideFooter
			hideCloseButton
		>
			<div className="flex justify-center flex-col">
				<div className="flex flex-row justify-between">
					<ChoiceButton
						color="bg-green-400"
						hoverColor="bg-green-500"
						feedbackType={FeedBackTypes.ILike}
						message="Something I like"
						icon={faSmile}
					/>

					<ChoiceButton
						color="bg-red-400"
						hoverColor="bg-red-500"
						feedbackType={FeedBackTypes.IDontLike}
						message="Something I dislike"
						icon={faFrown}
					/>

					<ChoiceButton
						color="bg-amber-400"
						hoverColor="bg-amber-500"
						feedbackType={FeedBackTypes.NewIdea}
						message="Something I would like to see"
						icon={faLightbulb}
					/>

					<ChoiceButton
						color="bg-red-600"
						hoverColor="bg-red-700"
						feedbackType={FeedBackTypes.Bug}
						message="A bug I found"
						icon={faBug}
					/>
				</div>

				<h5
					className={classNames(
						'cursor-default justify-start text-sm text-gray-500 py-0.5 text-red-500',
						error === 'category' ? 'visible' : 'invisible',
						//'pb-2 border-b border-b-[color:var(--fg-shade-four-color)]',
					)}
				>
					*Choose a category to help us categorize your feedback*
				</h5>

				<textarea
					className="border w-full p-2 mt-4 pb-3 bg-[color:var(--background-color)]"
					placeholder="Write your feedback here..."
					rows={2}
					cols={20}
					ref={textareaRef}
					onChange={() => {
						if (error === 'empty-text') {
							setError(undefined);
						}
					}}
					onKeyDown={e => e.key === 'Escape' && e.stopPropagation()}
				/>

				<h5
					className={classNames(
						'text-red-500 justify-start text-sm pt-1',
						error === 'empty-text' ? 'visible' : 'invisible',
					)}
				>
					*Please write something before submitting*
				</h5>

				{/* TODO implement that in the backend ↓ */}
				<div className="flex flex-row justify-between pt-4 pb-3 border-b border-b-[color:var(--fg-shade-four-color)]">
					<form>
						<input
							type="checkbox"
							ref={checkboxRef}
							className="pl-2"
							checked={addCollectedInformation}
							onChange={() => {
								setAddCollectedInformation(
									checkboxRef.current?.checked ?? true,
								);
							}}
						/>
						<label className="pl-3">
							I authorize my {InformationPopup()} to be sent anonymously with my
							feedback.
						</label>
					</form>
				</div>
				{/* cancel and send buttons */}
				<div className="flex flex-row justify-end pt-4 pb-3">
					<Button
						variant={'secondary'}
						onClick={() => {
							setIsOpen(false);
						}}
						className="mr-4"
					>
						Cancel
					</Button>
					<Button variant={'primary'} onClick={handleSubmit}>
						Send
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default FeedbackModal;
