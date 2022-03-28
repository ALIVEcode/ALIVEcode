import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import ResourceCard from '../../Components/Resources/ResourceCard/ResourceCard';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import { UserContext } from '../../state/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { SUBJECTS, getSubjectIcon } from '../../Types/sharedTypes';
import api from '../../Models/api';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ResourceSection } from '../../Components/Resources/ResourceSection/ResourceSection';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ResourceMenuSections, ResourceMenuProps } from './resourceMenuTypes';
import {
	ResourceMenuContext,
	ResourceMenuContextValues,
} from '../../state/contexts/ResourceContext';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';
import { RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { ResourceFilter } from '../../Components/Resources/ResourceFilter/ResourceFilter';
import MenuResourceCreation from '../../Components/Resources/MenuResourceCreation/MenuResourceCreation';

const ResourceMenu = ({ mode, onSelectResource }: ResourceMenuProps) => {
	const [creationModalOpen, setCreationModalOpen] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<RESOURCE_TYPE[]>([]);
	const [selectedSection, setSelectedSection] =
		useState<ResourceMenuSections>('all');

	const { t } = useTranslation();
	const { user, resources, setResources } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
		const getResources = async () => {
			setResources(
				await api.db.users.getResources(user.id, {
					subject: selectedSection !== 'all' ? selectedSection : undefined,
					types: selectedFilters.length > 0 ? selectedFilters : undefined,
				}),
			);
		};
		getResources();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSection, selectedFilters]);

	const getSelectedSectionName = () => {
		if (selectedSection === 'all') return t(`msg.subjects.all`);
		const enumEntry = Object.entries(SUBJECTS).find(
			entry => entry[1] === selectedSection,
		);
		if (!enumEntry) {
			setSelectedSection('all');
			return 'all';
		}
		return t(`msg.subjects.${enumEntry[0].toLowerCase()}`);
	};

	const isFilterSelected = useCallback(
		(filter: RESOURCE_TYPE) => {
			return selectedFilters.find(f => f === filter) != null;
		},
		[selectedFilters],
	);

	const toggleFilter = useCallback(
		(filter: RESOURCE_TYPE) => {
			if (isFilterSelected(filter))
				return setSelectedFilters(selectedFilters.filter(f => f !== filter));
			setSelectedFilters([...selectedFilters, filter]);
		},
		[isFilterSelected, selectedFilters],
	);

	const resourceContextValues: ResourceMenuContextValues = useMemo(() => {
		return {
			selectedSection,
			setSelectedSection,
			selectedFilters,
			setSelectedFilters,
			isFilterSelected,
			toggleFilter,
		};
	}, [selectedSection, selectedFilters, isFilterSelected, toggleFilter]);

	return (
		<ResourceMenuContext.Provider value={resourceContextValues}>
			<div className="w-full h-full flex flex-row bg-[color:var(--background-color)]">
				<div className="w-1/6 flex flex-col border-r border-[color:var(--bg-shade-four-color)]">
					<div className="h-20 text-xs p-2 flex justify-center items-center border-b border-[color:var(--bg-shade-four-color)]">
						<FormInput placeholder="Search"></FormInput>
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
								<span className="ml-2">{getSelectedSectionName()}</span>
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
							<Button
								variant="primary"
								onClick={() => setCreationModalOpen(true)}
							>
								{t('resources.form.create')}
							</Button>
						</div>
						<div className="grid grid-cols-1 phone:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 desktop:grid-cols-7 gap-4">
							{!resources ? (
								<LoadingScreen relative></LoadingScreen>
							) : (
								resources.map((r, idx) => (
									<ResourceCard
										onSelectResource={onSelectResource}
										mode={mode}
										resource={r}
										key={idx}
									/>
								))
							)}
						</div>
					</div>
				</div>
				<MenuResourceCreation
					setOpen={setCreationModalOpen}
					open={creationModalOpen}
				/>
			</div>
		</ResourceMenuContext.Provider>
	);
};

export default ResourceMenu;
