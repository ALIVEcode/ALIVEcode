import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import React, {
	useCallback,
	useContext,
	useEffect,
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

const InfoTutorial = ({
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
	const infos = useMemo(() => {
		return targets.map(target =>
			target.ref?.current
				? {
						border: target.ref.current.style.border,
				  }
				: {
						border: 'none',
				  },
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (open) {
			beforeDo && beforeDo();
			if (targets.length > 0) targets[0].onEnter && targets[0].onEnter();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const currentTarget = useRef(0);
	const myRef = useRef<HTMLDivElement>(null);

	const close = useCallback(() => {
		setOpen(false);
		currentTarget.current = 0;
		targets.forEach((target, idx) => {
			Object.entries(infos[idx]).forEach(
				([style, value]) =>
					target.ref?.current &&
					(target.ref.current.style[style as unknown as any] = value),
			);
		});
		forceUpdate();
	}, [forceUpdate, infos, setOpen, targets]);

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
			if (target.ref?.current) {
				target.ref.current.style.border = infos[idx].border;
			}
			return null;
		}

		const rect =
			target.ref?.current && target.ref.current.getBoundingClientRect();
		let offsetX: number;
		let offsetY: number;
		const contentStyle: React.CSSProperties = {};

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
				break;
			case 'left center':
				offsetX = rect ? rect.x : 0;
				offsetY = rect ? rect.y + rect.height / 2 : 0;
				contentStyle.paddingBottom = 15;
				break;
			case 'right center':
				offsetX = rect ? rect.x + rect.width : 0;
				offsetY = rect ? rect.y + rect.height / 2 : 0;
				contentStyle.paddingBottom = 15;
				break;
			default:
				offsetX = 0;
				offsetY = 0;
		}
		if (target.ref?.current) {
			if (idx === currentTarget.current) {
				target.ref.current.style.border = '2px solid var(--fourth-color)';
			} else {
				target.ref.current.style.border =
					(infos && infos[idx]?.border) ?? 'none';
			}
		}

		return (
			<Popup
				open={currentTarget.current === idx}
				closeOnDocumentClick={false}
				closeOnEscape={true}
				position={target.position}
				onClose={close}
				offsetX={target.ref && offsetX}
				offsetY={target.ref && offsetY}
				trigger={target.ref && <div className="hidden" />}
				contentStyle={target.ref && contentStyle}
				arrowStyle={{
					color: 'var(--fg-shade-four-color)',
				}}
			>
				<div
					className="flex flex-col rounded-md rounded-tl-none bg-[color:var(--fg-shade-four-color)] p-2
							text-[color:var(--background-color)] min-w-fit max-w-[50ch] text-wrap absolute text-center"
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
		<div
			className="w-full h-full bg-black bg-opacity-25 absolute left-0 top-0 z-[100]"
			ref={myRef}
		>
			{targets.map((target, idx) => {
				return renderTarget(target, idx);
			})}
		</div>
	) : null;
};

const Tutorial = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	const tutorialsRef = useRef<{ [name: string]: InfoTutorialProps }>({});

	const [currentTutorial, setCurrentTutorial] =
		useComplexState<InfoTutorialProps>();

	const [tutorialOpen, setTutorialOpen] = useState(false);

	const tutorialContextValues: TutorialContextValues = {
		getCurrent() {
			return currentTutorial?.name ?? null;
		},

		registerTutorial(tutorial: InfoTutorialProps) {
			tutorialsRef.current[tutorial.name] = tutorial;
		},

		unregisterTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return;
			delete tutorialsRef.current[name];
		},

		setCurrentTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return;
			if (currentTutorial?.name === name) return;
			setCurrentTutorial(tutorialsRef.current[name]);
		},

		startCurrentTutorial() {
			console.log(currentTutorial);
			setTutorialOpen(true);
		},

		startTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return;
			setCurrentTutorial(tutorialsRef.current[name]);
			this.startCurrentTutorial();
		},

		stopTutorial(name: string) {
			if (!(name in tutorialsRef.current)) return;
			setTutorialOpen(false);
		},
	};

	return (
		<TutorialContext.Provider value={tutorialContextValues}>
			{children}
			{currentTutorial && (
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
