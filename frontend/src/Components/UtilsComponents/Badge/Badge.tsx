import { classNames } from '../../../Types/utils';
export interface BadgeProps {
	variant: 'primary' | 'secondary' | 'third' | 'danger' | 'notification';
}

const Badge: React.FC<
	BadgeProps &
		React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLDivElement>,
			HTMLDivElement
		>
> = ({ variant, className, children, ...other }) => {
	return (
		<span
			className={classNames(
				variant === 'primary' &&
					'bg-[color:var(--primary-color)] text-[color:var(--foreground-color)]',
				variant === 'secondary' &&
					'bg-[color:var(--secondary-color)] text-white',
				variant === 'third' && 'bg-[color:var(--third-color)] text-white',
				variant === 'danger' && 'bg-red-500 text-white',
				variant === 'notification' && 'bg-red-700 text-white',
				'inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded',
				className,
			)}
			{...other}
		>
			{children}
		</span>
	);
};

export default Badge;
