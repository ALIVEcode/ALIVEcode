import { FeedbackModalProps } from './feedbackModalTypes';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Button from '../../UtilsComponents/Buttons/Button';
import {
	faBug,
	faFrown,
	faLightbulb,
	faSmile,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FeedBackTypes } from '../../../Models/Feedbacks/entities/feedback.entity';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { classNames } from '../../../Types/utils';
import { Popup } from 'reactjs-popup';

const FeedbackModal = ({
	isOpen,
	setIsOpen,
	onOpen,
	onClose,
}: FeedbackModalProps) => {
	const handleSubmit = (values: any) => {
		console.log(values);
	};

	const [feedbackType, setFeedbackType] = useState<FeedBackTypes>();

	const feedbackTypeMatches = (type: FeedBackTypes) => {
		return feedbackType === undefined || feedbackType === type;
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
				icon={icon}
				className={classNames(
					`hover:${hoverColor}`,
					feedbackTypeMatches(feedbackType) ? color : unselectedColor,
					'px-1.5 mx-1.5',
				)}
				onClick={() => {
					setFeedbackType(feedbackType);
				}}
			>
				{message}
			</Button>
		);
	};

	return (
		<FormModal
			open={isOpen}
			setOpen={setIsOpen}
			size="md"
			onSubmit={res => handleSubmit(res)}
			title="What's on your mind?"
			onShow={() => {
				setFeedbackType(undefined);
			}}
		>
			<div className="flex justify-center flex-col">
				<div className="flex flex-row justify-between">
					<ChoiceButton
						color="bg-green-400"
						hoverColor="hover:bg-green-500"
						feedbackType={FeedBackTypes.ILike}
						message="Something I like"
						icon={faSmile}
					/>

					<ChoiceButton
						color="bg-red-400"
						hoverColor="hover:bg-red-500"
						feedbackType={FeedBackTypes.IDontLike}
						message="Something I dislike"
						icon={faFrown}
					/>

					<ChoiceButton
						color="bg-amber-400"
						hoverColor="hover:bg-amber-500"
						feedbackType={FeedBackTypes.NewIdea}
						message="Something I would like to see"
						icon={faLightbulb}
					/>

					<ChoiceButton
						color="bg-red-600"
						hoverColor="hover:bg-red-700"
						feedbackType={FeedBackTypes.Bug}
						message="A bug I found"
						icon={faBug}
					/>
				</div>
				<h5
					className="cursor-default text-center text-sm text-gray-500 mb-3 pt-2
				pb-2 border-b border-b-[color:var(--fg-shade-four-color)]"
				>
					Choose a category to help us categorized your feedback
				</h5>

				<textarea
					className="border w-full p-2 mt-4 pb-3 bg-[color:var(--background-color)]"
					placeholder="Write your feedback here..."
					rows={2}
					cols={20}
				/>
				{/*	a box asking to send anonymously information about the person's computer when sending the feedback */}
				<div className="flex flex-row justify-between pt-4 pb-3 border-b border-b-[color:var(--fg-shade-four-color)]">
					<form>
						<input type="checkbox" className="pl-2" checked />
						<label className="pl-3">
							I authorize my{' '}
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
									<h3 className="text-md pb-1.5">Informations implies:</h3>
									<ul className="list-disc pl-4 text-sm">
										<li>The page you are on right now</li>
										<li>The browser you are using</li>
										<li>
											The settings of your session (light/dark theme, language
											settings, etc.)
										</li>
									</ul>
								</div>
							</Popup>{' '}
							to be sent anonymously with my feedback.
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
					<Button
						variant={'primary'}
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Send
					</Button>
				</div>
			</div>
		</FormModal>
	);
};

export default FeedbackModal;
