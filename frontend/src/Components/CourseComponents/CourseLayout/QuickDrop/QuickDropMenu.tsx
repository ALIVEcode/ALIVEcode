import { QuickDropMenuProps } from '../courseLayoutTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import QuickDropItems from './QuickDropItems';

const QuickDropMenu = ({ open, setOpen }: QuickDropMenuProps) => {
	return (
		<>
			{open ? (
				<div className="absolute top-3 flex right-2 flex-row h-[calc(100%-3rem)] w-fit">
					<div
						className="relative h-fit cursor-pointer px-2 bg-[color:var(--bg-shade-one-color)] hover:bg-[color:var(--bg-shade-two-color)]"
						onClick={() => setOpen(false)}
					>
						<FontAwesomeIcon icon={faCaretRight} size="3x" />
					</div>
					<div className="relative bg-[color:var(--bg-shade-three-color)] h-full w-32">
						<QuickDropItems />
					</div>
				</div>
			) : (
				<div
					className="absolute cursor-pointer top-3 right-1 px-2 bg-[color:var(--bg-shade-one-color)] hover:bg-[color:var(--bg-shade-two-color)]"
					onClick={() => setOpen(true)}
				>
					<FontAwesomeIcon icon={faCaretLeft} size="3x" />
				</div>
			)}
		</>
	);
};

export default QuickDropMenu;
