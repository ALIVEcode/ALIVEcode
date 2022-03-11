import { HomeSectionProps } from './homeSectionTypes';
import { classNames } from '../../../Types/utils';
import { HomeButton } from '../../UtilsComponents/Buttons/HomeButton';
import { forwardRef } from 'react';

export const HomeSection = forwardRef<HTMLDivElement, HomeSectionProps>(
	(
		{
			title,
			text,
			img,
			imgAlt,
			reverse,
			button,
			imgOpacity,
			important,
			...buttonProps
		},
		ref,
	) => {
		return (
			<div
				className={classNames(
					'w-full h-full flex flex-col items-center font-normal mt-20 p-5 gap-8 rounded-3xl bg-[color:rgba(var(--background-color-rgb),0.6)] laptop:bg-transparent',
					'tablet:gap-8 tablet:p-5',
					'laptop:gap-16 laptop:p-10',
					'desktop:gap-32 desktop:p-16',
					reverse ? 'tablet:flex-row-reverse' : 'tablet:flex-row',
				)}
				ref={ref}
			>
				<div className="tablet:w-2/5 laptop:w-1/3 h-full">
					<img
						src={img}
						alt={imgAlt}
						className={'w-full h-auto rounded-xl '}
						style={{ opacity: imgOpacity }}
					/>
				</div>
				<div className="tablet:w-3/5 laptopt:w-1/3 flex items-center">
					<div>
						<div
							className={classNames(
								'tracking-tight',
								important
									? 'font-semibold text-4xl tablet:text-3xl laptop:text-4xl desktop:text-5xl mb-6 tablet:mb-7 desktop:mb-10'
									: 'text-3xl tablet:text-2xl laptop:text-3xl desktop:text-4xl mb-6 tablet:mb-3 desktop:mb-6',
							)}
						>
							{title}
						</div>
						<div
							className={classNames(
								'tablet:leading-normal laptop:leading-relaxed desktop:leading-loose text-justify',
								important
									? 'text-xl tablet:text-base laptop:text-xl desktop:text-2xl'
									: 'text-lg tablet:text-sm laptop:text-lg desktop:text-xl',
							)}
						>
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
	},
);
