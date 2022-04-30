import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import ResourceCard from '../../Components/Resources/ResourceCard/ResourceCard';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import { UserContext } from '../../state/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { SUBJECTS, getSubjectIcon } from '../../Types/sharedTypes';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ResourceSection } from '../../Components/Resources/ResourceSection/ResourceSection';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ResourceMenuSubjects, ResourceMenuProps } from './resourceMenuTypes';
import {
	ResourceMenuContext,
	ResourceMenuContextValues,
} from '../../state/contexts/ResourceContext';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';
import { RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { ResourceFilter } from '../../Components/Resources/ResourceFilter/ResourceFilter';
import useWaitBeforeUpdate from '../../state/hooks/useWaitBeforeUpdate';

/**
 * ResourceMenu is a page that allows a user to get/create/update/delete its resources.
 * It also provides filters to query the resources of the user
 *
 * @param mode Mode of the menu (import or default)
 * @param filters The default selected filters
 * @param onSelectResource Callback that has the resource selected as a parameter
 * @returns The resource menu
 * @author Enric Soldevila
 */
const ResourceMenu = ({
	mode,
	filters,
	onSelectResource,
}: ResourceMenuProps) => {
	const [selectedFilters, setSelectedFilters] = useState<RESOURCE_TYPE[]>(
		filters ?? [],
	);
	const [selectedSubject, setSelectedSubject] =
		useState<ResourceMenuSubjects>('all');

	const { t } = useTranslation();
	const { resources, getResources, setResourceCreationMenuOpen } =
		useContext(UserContext);

	/**
	 * Function that get the resources of the user based on the query
	 */
	const getResourcesFromMenuInputs = async () => {
		return getResources(selectedSubject, name, selectedFilters);
	};

	const [name, setName] = useWaitBeforeUpdate(
		{ wait: 500, onUpdate: getResourcesFromMenuInputs },
		'',
	);

	/** Gets the user resources when the selectedSubject */
	useEffect(() => {
		getResourcesFromMenuInputs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSubject, selectedFilters]);

	/**
	 * Gets the translated name of the currently selected subject
	 * @returns The translated name
	 */
	const getSelectedSubjectName = () => {
		if (selectedSubject === 'all') return t(`msg.subjects.all`);
		const enumEntry = Object.entries(SUBJECTS).find(
			entry => entry[1] === selectedSubject,
		);
		if (!enumEntry) {
			setSelectedSubject('all');
			return 'all';
		}
		return t(`msg.subjects.${enumEntry[0].toLowerCase()}`);
	};

	/**
	 * Checks if a filter is selected
	 * @returns True if the filter is selected, otherwise false
	 */
	const isFilterSelected = useCallback(
		(filter: RESOURCE_TYPE) => {
			return selectedFilters.find(f => f === filter) != null;
		},
		[selectedFilters],
	);

	/**
	 * Toggles a filter on or off
	 * @param filter Filter to toggle on or off
	 */
	const toggleFilter = useCallback(
		(filter: RESOURCE_TYPE) => {
			if (isFilterSelected(filter))
				return setSelectedFilters(selectedFilters.filter(f => f !== filter));
			setSelectedFilters([...selectedFilters, filter]);
		},
		[isFilterSelected, selectedFilters],
	);

	/**
	 * The values of the resource context for the other components inside
	 * the same context
	 */
	const resourceContextValues: ResourceMenuContextValues = useMemo(() => {
		return {
			mode: mode ?? 'default',
			selectedSubject,
			setSelectedSubject,
			selectedFilters,
			setSelectedFilters,
			isFilterSelected,
			toggleFilter,
		};
	}, [mode, selectedSubject, selectedFilters, isFilterSelected, toggleFilter]);

	return (
		<ResourceMenuContext.Provider value={resourceContextValues}>
			<div className="w-full h-full flex flex-row bg-[color:var(--background-color)]">
				<div className="w-1/6 flex flex-col border-r border-[color:var(--bg-shade-four-color)]">
					<div className="h-20 text-xs p-2 flex justify-center items-center border-b border-[color:var(--bg-shade-four-color)]">
						<FormInput
							placeholder={t('resources.menu.search')}
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
								if (e.keyCode === 13) {
									setName(e.currentTarget.value);
									getResourcesFromMenuInputs();
								}
							}}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
						/>
					</div>
					<div className="w-full h-full overflow-y-auto">
						<ResourceSection
							icon={faBars}
							name={t(`msg.subjects.all`)}
							section="all"
						/>
						{Object.entries(SUBJECTS).map(entry => (
							<ResourceSection
								key={entry[0]}
								icon={getSubjectIcon(entry[1])}
								name={t(`msg.subjects.${entry[0].toLowerCase()}`)}
								section={entry[1]}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col w-full h-full">
					<div className="h-20 px-4 flex items-center border-b border-[color:var(--bg-shade-four-color)]">
						<div className="mr-4">
							<label className="text-xl">{t('resources.menu.title')}</label>
							<label className="ml-2 text-xl text-[color:var(--fg-shade-four-color)]">
								<span>/</span>
								<span className="ml-2">{getSelectedSubjectName()}</span>
							</label>
						</div>
						<div className="overflow-x-auto flex">
							{Object.entries(RESOURCE_TYPE).map(entry => (
								<ResourceFilter
									key={entry[0]}
									name={t(`resources.${entry[0].toLowerCase()}.name`)}
									filter={entry[1]}
								/>
							))}
						</div>
					</div>
					<div className="w-full h-full p-4">
						<div className="flex flex-col items-center mb-4">
							{mode !== 'import' && (
								<Button
									variant="primary"
									onClick={() => setResourceCreationMenuOpen(true)}
								>
									{t('resources.form.create')}
								</Button>
							)}
						</div>
						<div className="grid grid-cols-1 phone:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 desktop:grid-cols-7 gap-4">
							{!resources ? (
								<LoadingScreen relative></LoadingScreen>
							) : (
								resources.map(r => (
									<ResourceCard
										onSelectResource={onSelectResource}
										mode={mode}
										resource={r}
										key={r.id}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</ResourceMenuContext.Provider>
	);
};

export default ResourceMenu;
