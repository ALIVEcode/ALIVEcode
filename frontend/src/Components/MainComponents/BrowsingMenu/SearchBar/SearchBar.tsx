import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
	return (
		<div className="rounded-md bg-[color:var(--background-color)] text-[color:var(--fg-shade-two-color)]">
			<div className="inline p-3">
				<FontAwesomeIcon icon={faSearch} />
			</div>
			<input
				className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]"
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
		</div>
	);
};

export default SearchBar;
