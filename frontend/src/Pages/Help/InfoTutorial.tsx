import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	InfoTutorialProps,
	InfoTutorialTarget,
} from '../../Components/HelpComponents/HelpProps';
import { Popup } from 'reactjs-popup';
import NavigationButtons from '../../Components/HelpComponents/NavigationButtons';
import {
	TutorialContext,
	TutorialContextValues,
} from '../../state/contexts/TutorialContext';
import useComplexState from '../../state/hooks/useComplexState';

/**
 * This component is used to display the tutorial information.
 * It is used in the Help page.
 *
 * @param targets The elements that should be highlighted by the tutorial.
 *
 * @author Mathis Laroche
 */
const InfoTutorial = forwardRef(
	({
		targets,
		open,
		setOpen,
		beforeDo,
		afterDo,
	}: InfoTutorialProps & {
		open: boolean;
		setOpen: (value: boolean) => void;
	}) => {
		const { t } = useTranslation();
		const forceUpdate = useForceUpdate();

		useEffect(() => {
			if (open) {
				beforeDo && beforeDo();
				if (targets.length > 0) targets[0].onEnter && targets[0].onEnter();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [open]);

		const currentTarget = useRef(0);
		const myRef = useRef<HTMLDivElement>(null);

		const highlighter = (
			<div
				className="absolute border-2 border-[color:var(--fourth-color)]"
				ref={myRef}
			/>
		);

		const close = useCallback(() => {
			setOpen(false);
			currentTarget.current = 0;
			forceUpdate();
		}, [forceUpdate, setOpen, targets]);

		const nextTargetOrClose = useCallback(() => {
			const target = targets[currentTarget.current];
			target.onExit && target.onExit();
			if (currentTarget.current < targets.length - 1) {
				currentTarget.current++;
				const newTarget = targets[currentTarget.current];
				newTarget.onEnter && newTarget.onEnter();
				forceUpdate();
			} else {
				afterDo && afterDo();
				close();
			}
		}, [afterDo, close, forceUpdate, targets]);

		const previousTarget = useCallback(() => {
			const target = targets[currentTarget.current];
			target.onExit && target.onExit();
			if (currentTarget.current > 0) {
				currentTarget.current--;
				const newTarget = targets[currentTarget.current];
				newTarget.onEnter && newTarget.onEnter();
				forceUpdate();
			}
		}, [forceUpdate, targets]);

		const renderTarget = (target: InfoTutorialTarget, idx: number) => {
			if (idx !== currentTarget.current) {
				return null;
			}

			const rect = target.ref && target.ref.getBoundingClientRect();
			let offsetX: number;
			let offsetY: number;
			const contentStyle: React.CSSProperties = {};
			let notRounded = '';

			switch (target.position) {
				case 'top center':
					offsetX = rect ? rect.x + rect.width / 2 : 0;
					offsetY = rect ? rect.y : 0;
					// TODO add the right amount of padding
					break;
				case 'bottom center':
					offsetX = rect ? rect.x + rect.width / 2 : 0;
					offsetY = rect ? rect.y + rect.height : 0;
					contentStyle.paddingBottom = 15;
					contentStyle.paddingRight = 15;
					notRounded = 'rounded-tl-none';
					break;
				case 'left center':
					offsetX = rect ? -rect.x : 0;
					offsetY = rect ? rect.y + rect.height / 2 : 0;
					contentStyle.paddingBottom = 15;
					contentStyle.paddingRight = 200;
					notRounded = 'rounded-tr-none';
					break;
				case 'right center':
					offsetX = rect ? rect.x + rect.width : 0;
					offsetY = rect ? rect.y + rect.height / 2 : 0;
					contentStyle.paddingBottom = 15;
					notRounded = 'rounded-tl-none';
					break;
				default:
					offsetX = 0;
					offsetY = 0;
			}
			if (rect && myRef.current) {
				// target.ref.style.border = '2px solid var(--fourth-color)';
				myRef.current.style.top = rect.top.toString() + 'px';
				myRef.current.style.left = rect.left.toString() + 'px';
				myRef.current.style.width = rect.width.toString() + 'px';
				myRef.current.style.height = rect.height.toString() + 'px';
			}

			return (
				<Popup
					open={currentTarget.current === idx}
					closeOnDocumentClick={false}
					closeOnEscape={true}
					position={target.position}
					onClose={close}
					offsetX={offsetX}
					offsetY={offsetY}
					trigger={
						target.ref === null
							? undefined
							: target.ref && <div id="tutorial-target" className="hidden" />
					}
					arrow={target.ref !== null}
					contentStyle={contentStyle}
					arrowStyle={{
						color: 'var(--fg-shade-four-color)',
					}}
				>
					<div
						className={
							'flex flex-col rounded-md bg-[color:var(--fg-shade-four-color)] p-2 ' +
							notRounded +
							' text-[color:var(--background-color)] min-w-fit max-w-[50ch] text-wrap absolute text-center'
						}
					>
						<section className="pt-1.5">{target.infoBox}</section>
						<section>
							<NavigationButtons
								max={targets.length - 1}
								current={currentTarget}
								next={nextTargetOrClose}
								previous={previousTarget}
							/>
						</section>
					</div>
				</Popup>
			);
		};
		return open ? (
			<div className="w-full h-full bg-black bg-opacity-25 absolute left-0 top-0 z-[100]">
				{targets.map((target, idx) => {
					return renderTarget(target, idx);
				})}
				{highlighter}
			</div>
		) : null;
	},
);

/**
 *
 * @param children
 * @constructor
 *
 * @author Mathis Laroche
 */
const Tutorial = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	const tutorialsRef = useRef<{ [name: string]: InfoTutorialProps }>({});

	const [currentTutorial, setCurrentTutorial] =
		useComplexState<InfoTutorialProps | null>(null);

	const [tutorialOpen, setTutorialOpen] = useState(false);

	const tutorialContextValues: TutorialContextValues = {
		getCurrent() {
			return currentTutorial?.name ?? null;
		},

		unregisterTutorial(name: string) {
			if (currentTutorial?.name === name) setCurrentTutorial(null);
			// if (name in tutorialsRef.current) delete tutorialsRef.current[name];
			// forceUpdate();
		},

		registerTutorial(tutorial: InfoTutorialProps) {
			// tutorialsRef.current[tutorial.name] = tutorial;
			setCurrentTutorial(tutorial);
			return () => setCurrentTutorial(null);
		},

		setCurrentTutorial(name: string) {
			// if (!(name in tutorialsRef.current)) return;
			// if (currentTutorial?.name === name) return;
			// setCurrentTutorial(tutorialsRef.current[name]);
		},

		startCurrentTutorial() {
			if (currentTutorial === null) return () => {};
			// if (!(currentTutorial.name in tutorialsRef.current)) return;
			setTutorialOpen(true);
			return () => setTutorialOpen(false);
		},

		stopCurrentTutorial() {
			setTutorialOpen(false);
		},

		startTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return () => {};
			setCurrentTutorial(tutorialsRef.current[name]);
			this.startCurrentTutorial();
			return () => setTutorialOpen(false);
		},

		stopTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return;
			setTutorialOpen(false);
		},
	};

	return (
		<TutorialContext.Provider value={tutorialContextValues}>
			{children}
			{currentTutorial && currentTutorial.targets && (
				<InfoTutorial
					{...currentTutorial}
					open={tutorialOpen}
					setOpen={setTutorialOpen}
				/>
			)}
		</TutorialContext.Provider>
	);
};

export default Tutorial;
