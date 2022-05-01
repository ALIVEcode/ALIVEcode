import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';

const NavigationButtons = ({
	max,
	min = 0,
	current,
	next,
	previous,
}: {
	max: number;
	min?: number;
	current: number;
	next: () => void;
	previous: () => void;
}) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-row justify-evenly align-middle pt-12">
			<button
				className="flex items-center gap-2 cursor-pointer disabled:cursor-auto disabled:opacity-40"
				disabled={current === min}
				onClick={previous}
			>
				<FontAwesomeIcon size="1x" icon={faChevronLeft} />
				<span className="pr-3">{t('help.slides.previous')}</span>
			</button>

			{current === max ? (
				<button
					className="flex items-center gap-4 cursor-pointer disabled:cursor-auto"
					onClick={next}
				>
					<span
						className="hover:text-[color:var(--background-color)] text-[color:var(--fourth-color)]
								hover:bg-[color:var(--fourth-color)] bg-[color:var(--background-color)]
								transition-colors
							  border-[color:var(--fourth-color)] border rounded-md text-md px-1 mr-4 ml-3 py-0.5"
					>
						{t('modal.close')}
					</span>
				</button>
			) : (
				<button
					className="flex items-center gap-2 cursor-pointer disabled:cursor-auto disabled:opacity-25"
					onClick={next}
				>
					<span className="pl-3">{t('help.slides.next')}</span>
					<FontAwesomeIcon size="1x" icon={faChevronRight} />
				</button>
			)}
		</div>
	);
};

export default NavigationButtons;
