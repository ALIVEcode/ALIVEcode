import {
	BrowsingMenuProps,
	StyledBrowsingMenu,
	BrowsingQuery,
} from './browsingMenuTypes';
import SearchBar from './SearchBar/SearchBar';
import { useState, useEffect } from 'react';
import Button from '../../UtilsComponents/Button/Button';
import { useTranslation } from 'react-i18next';

/**
 * Generic browsing menu that returns an array of T based on the apiRequest made and the query.
 *
 * @param {(arg: BrowsingResults<T>) => void} onChange returns the new results of the query containing the T elements
 * @param {boolean} fetchOnSubmit if it auto fetches when exiting the search bar or pressing enter
 * @param {(arg: BrowsingQuery) => Promise<T[]>} apiRequest callback function that gets called with the query and must return the resulting objects
 *
 * @author MoSk3
 */
const BrowsingMenu = <T extends any>({
	onChange,
	fetchOnSubmit,
	apiRequest,
}: BrowsingMenuProps<T>) => {
	const [query, setQuery] = useState<BrowsingQuery>({});
	const [oldQuery, setOldQuery] = useState<BrowsingQuery>();
	const { t } = useTranslation();

	const getResults = async () => {
		if (JSON.stringify(oldQuery) === JSON.stringify(query)) return;
		const levels = await apiRequest(query);
		setOldQuery(query);
		onChange({
			results: levels,
			nbResults: levels.length,
		});
	};

	useEffect(() => {
		getResults();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledBrowsingMenu>
			<div>
				<SearchBar
					value={query.txt || ''}
					setValue={txt => setQuery({ ...query, txt })}
					onSubmit={() => fetchOnSubmit && getResults()}
				/>
			</div>
			<div>
				<Button variant="primary" onClick={getResults}>
					{t('msg.search')}
				</Button>
			</div>
		</StyledBrowsingMenu>
	);
};

export default BrowsingMenu;