import { HomeSectionProps } from './homeSectionTypes';
import { classNames } from '../../../Types/utils';
import { HomeButton } from '../../UtilsComponents/Buttons/HomeButton';

export const HomeSection = ({
	title,
	text,
	img,
	imgAlt,
	reverse,
	button,
	...buttonProps
}: HomeSectionProps) => {
	return (
		<div
			className={classNames(
				'w-full h-full flex flex-col items-center font-normal mt-20 px-5 gap-8',
				'tablet:gap-8 tablet:px-5',
				'laptop:gap-32 laptop:px-10',
				'desktop:px-16',
				reverse ? 'tablet:flex-row-reverse' : 'tablet:flex-row',
			)}
		>
			<div className="tablet:w-2/5 laptop:w-1/3 h-full">
				<img src={img} alt={imgAlt} className="w-full h-auto rounded-xl" />
			</div>
			<div className="tablet:w-3/5 laptopt:w-1/3 flex items-center">
				<div>
					<div className="text-3xl tablet:text-2xl laptop:text-3xl desktop:text-4xl tracking-tight mb-6 tablet:mb-3 desktop:mb-6">
						{title}
					</div>
					<div className="text-lg tablet:leading-normal tablet:text-sm laptop:leading-relaxed laptop:text-lg desktop:leading-loose desktop:text-xl text-justify">
						{text}
					</div>
					{button && (
						<HomeButton
							className="mt-5 tracking-wide !text-lg !px-4 !py-2 tablet:!text-base laptop:!text-lg"
							{...buttonProps}
						>
							{button}
						</HomeButton>
					)}
				</div>
			</div>
		</div>
	);
};
