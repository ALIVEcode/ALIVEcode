import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { SearchBarProps } from './searchBarTypes';

/**
 * Search bar component of the browsing menu
 *
 * @param {string} value value shown in the search bar
 * @param {(txt: string) => value} setValue function that updates the parent state of the value
 * @param {(txt: string) => value} onSubmit callback called when the search is triggered (search icon clicked) or enter pressed
 *
 * @author Enric Soldevila
 */
const SearchBar = ({ value, setValue, onSubmit }: SearchBarProps) => {
	const searchRef = useRef<HTMLInputElement>(null);

	return (
		<div className="rounded-md bg-[color:var(--background-color)] text-[color:var(--fg-shade-two-color)] border border-[color:var(--bg-shade-four-color)]">
			<input
				ref={searchRef}
				className="shadow bg-transparent appearance-none py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)]"
				value={value}
				onChange={e => setValue(e.target.value)}
				onBlur={(e: any) => {
					setValue(e.target.value);
					onSubmit && onSubmit(e.target.value);
				}}
				onKeyDown={(e: any) => {
					if (e.keyCode === 13) {
						setValue(e.target.value);
						onSubmit && onSubmit(e.target.value);
					}
				}}
				type="text"
			/>
			<div
				className="inline p-3 cursor-pointer"
				onClick={() =>
					onSubmit && searchRef.current && onSubmit(searchRef.current.value)
				}
			>
				<FontAwesomeIcon icon={faSearch} />
			</div>
		</div>
	);
};

export default SearchBar;
