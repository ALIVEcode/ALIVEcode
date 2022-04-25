import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { InfoTutorialProps, InfoTutorialTarget } from './HelpProps';
import { Popup } from 'reactjs-popup';
import NavigationButtons from './NavigationButtons';

const InfoTutorial = ({
	targets,
	open,
	setOpen,
	beforeDo,
}: InfoTutorialProps) => {
	const { t } = useTranslation();
	const forceUpdate = useForceUpdate();

	const infos = useMemo(() => {
		return targets.map(target =>
			target.ref.current
				? {
						border: target.ref.current.style.border,
						zIndex: target.ref.current.style.zIndex,
				  }
				: {
						border: 'none',
						zIndex: 'auto',
				  },
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (open) beforeDo && beforeDo();
	}, [open]);

	const currentTarget = useRef(0);
	const myRef = useRef<HTMLDivElement>(null);

	const close = useCallback(() => {
		setOpen(false);
		currentTarget.current = 0;
		targets.forEach((target, idx) => {
			Object.entries(infos[idx]).forEach(
				([style, value]) =>
					target.ref.current &&
					(target.ref.current.style[style as unknown as any] = value),
			);
		});
		forceUpdate();
	}, [forceUpdate, infos, setOpen, targets]);

	const nextTargetOrClose = useCallback(() => {
		const target = targets[currentTarget.current];
		target.afterDo && target.afterDo();
		if (currentTarget.current < targets.length - 1) {
			currentTarget.current++;
			forceUpdate();
		} else {
			close();
		}
	}, [close, forceUpdate, targets.length]);

	const previousTarget = useCallback(() => {
		if (currentTarget.current > 0) {
			currentTarget.current--;
			forceUpdate();
		}
	}, [forceUpdate]);

	const renderTarget = (target: InfoTutorialTarget, idx: number) => {
		if (idx !== currentTarget.current) {
			if (target.ref.current) {
				target.ref.current.style.border = infos[idx].border;
				target.ref.current.style.zIndex = infos[idx].zIndex;
			}
			return null;
		}

		const rect =
			target.ref.current && target.ref.current.getBoundingClientRect();
		let offsetX: number;
		let offsetY: number;

		switch (target.position) {
			case 'top center':
				offsetX = rect ? rect.x + rect.width / 2 : 0;
				offsetY = rect ? rect.y : 0;
				break;
			case 'bottom center':
				offsetX = rect ? rect.x + rect.width / 2 : 0;
				offsetY = rect ? rect.y + rect.height : 0;
				break;
			case 'left center':
				offsetX = rect ? rect.x : 0;
				offsetY = rect ? rect.y + rect.height / 2 : 0;
				break;
			case 'right center':
				offsetX = rect ? rect.x + rect.width : 0;
				offsetY = rect ? rect.y + rect.height / 2 : 0;
				break;
			default:
				offsetX = 0;
				offsetY = 0;
		}
		if (target.ref.current) {
			if (idx === currentTarget.current) {
				target.ref.current.style.border = '2px solid var(--fourth-color)';
				target.ref.current.style.zIndex = '100';
			} else {
				target.ref.current.style.border = infos[idx].border;
				target.ref.current.style.zIndex = infos[idx].zIndex;
			}
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
				trigger={<div className="hidden" />}
				contentStyle={{
					paddingBottom: 15,
				}}
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
			className="w-full h-full bg-black bg-opacity-25 absolute left-0 top-0 z-[90]"
			ref={myRef}
		>
			{targets.map((target, idx) => {
				return renderTarget(target, idx);
			})}
		</div>
	) : null;
};

export default InfoTutorial;
