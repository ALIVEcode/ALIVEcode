import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import api from '../../../Models/api';
import { useState, useContext, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { getResourceIcon, SUBJECTS } from '../../../Types/sharedTypes';
import { Challenge } from '../../../Models/Challenge/challenge.entity';
import FormLabel from '../../UtilsComponents/FormLabel/FormLabel';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import Link from '../../UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import { instanceToPlain } from 'class-transformer';
import {
	MenuResourceCreationDTO,
	MenuResourceCreationProps,
} from './menuResourceCreationTypes';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import MenuCreation from '../../UtilsComponents/MenuCreation/MenuCreation';
import ProgressBar from '../../UtilsComponents/ProgressBar/ProgressBar';

/**
 * Menu that allows for the creation and updating of a resource
 *
 * @param open state of the menu
 * @param setOpen the state handler of the menu
 * @param updateMode (Optional) If the menu is in edit mode or not (create mode)
 * @param defaultResource (Optional) The default resource to update in updateMode
 * @returns The rendered menu
 * @author Enric Soldevila, Maxime Gazze
 */
const MenuResourceCreation = ({
	open,
	setOpen,
	updateMode,
	defaultResource,
}: MenuResourceCreationProps) => {
	const [type, setType] = useState<RESOURCE_TYPE | undefined>(
		defaultResource?.type ?? undefined,
	);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [resourceIsFile, setResourceIsFile] = useState<boolean>(true);

	const { t } = useTranslation();
	const { setResources, resources } = useContext(UserContext);
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const defaultValues = useMemo(() => {
		return {
			type,
			resource: instanceToPlain(defaultResource),
		};
	}, [defaultResource, type]);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<MenuResourceCreationDTO>({
		defaultValues,
	});

	/**
	 * Loads the user challenges and rerenders the menu
	 * @author Enric Soldevila
	 */
	const loadUserChallenges = async () => {
		if (!user) return;
		setChallenges(await api.db.users.getChallenges({ id: user?.id }));
	};

	/** Loads user challenges on first render */
	useEffect(() => {
		if (type === RESOURCE_TYPE.CHALLENGE) loadUserChallenges();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!resources) return <LoadingScreen></LoadingScreen>;

	/**
	 * Handle the chosing of a new resource type for the resource creation.
	 * Loads the user challenges if it is a Challenge resource
	 * @param newType New resource type to create
	 * @author Enric Soldevila
	 */
	const onSelectResourceType = async (newType: RESOURCE_TYPE) => {
		if (type === newType) return setType(undefined);
		if (newType === RESOURCE_TYPE.CHALLENGE) loadUserChallenges();
		setType(newType);
	};

	/**
	 * Handles the form submission. Sends data to the server to update
	 * or create a resource with all the properties chosen in the menu.
	 * @param formValues Form values returned by the form submission
	 * @author Enric Soldevila, Maxime Gazze
	 */
	const onSubmit = async (formValues: MenuResourceCreationDTO) => {
		if (!type) return;
		formValues.type = type;

		if (resourceIsFile) formValues.file = file;

		if (updateMode && defaultResource) {
			const updatedRes = await api.db.resources.update(
				defaultResource,
				formValues.resource,
			);
			setResources(
				resources.map(r => (r.id === updatedRes.id ? updatedRes : r)),
			);
		} else {
			const resource = await api.db.resources.create(
				formValues,
				setUploadProgress,
			);
			setResources([...resources, resource]);
		}
		setOpen(false);
		// reset
		setFile(null);
		setUploadProgress(0);
	};

	const onChangeRadio = event => {
		const value = event.target.value === 'file';
		console.log(value);
		setResourceIsFile(value);
	};

	/**
	 * Generates the correct inputs specific to a type of resource. For example,
	 * for a file show a input of type "file".
	 * @returns Rendered input components and labels
	 * @author Enric Soldevila, Maxime Gazze
	 */
	const renderSpecificFields = () => {
		switch (type) {
			case RESOURCE_TYPE.CHALLENGE:
				return (
					<>
						<FormLabel>{t('resources.challenge.form.select')}</FormLabel>
						{challenges.length <= 0 ? (
							<div>
								<i>{t('dashboard.challenges.empty')}. </i>
								<Link dark to={routes.auth.challenge_create.path}>
									{t('dashboard.challenges.create_challenge')}
								</Link>
							</div>
						) : (
							<FormInput
								as="select"
								errors={errors.resource?.challengeId}
								{...register('resource.challengeId', { required: true })}
							>
								{challenges.map((c, idx) => (
									<option key={idx} value={c.id}>
										{c.name}
									</option>
								))}
							</FormInput>
						)}
					</>
				);
			case RESOURCE_TYPE.THEORY:
				return <></>;
			case RESOURCE_TYPE.VIDEO:
				return (
					<>
						<div onChange={onChangeRadio}>
							<input
								type="radio"
								name="resource"
								value="file"
								id="file"
								defaultChecked
							/>
							<label htmlFor="file">file</label>
							<input type="radio" name="resource" value="url" id="url" />
							<label htmlFor="url">url</label>
						</div>
						{resourceIsFile ? (
							<>
								<InputGroup
									type="file"
									label={t('resources.image.form.file')}
									errors={errors.resource?.url}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										e.target.files && setFile(e.target.files[0])
									}
								/>
								<ProgressBar progress={uploadProgress} />
							</>
						) : (
							<InputGroup
								label={t('resources.video.form.url')}
								errors={errors.resource?.url}
								{...register('resource.url', { required: false })}
							/>
						)}
					</>
				);
			case RESOURCE_TYPE.IMAGE:
				return (
					<>
						<div onChange={onChangeRadio}>
							<input
								type="radio"
								name="resource"
								value="file"
								id="file"
								defaultChecked
							/>
							<label htmlFor="file">file</label>
							<input type="radio" name="resource" value="url" id="url" />
							<label htmlFor="url">url</label>
						</div>
						{resourceIsFile ? (
							<>
								<InputGroup
									type="file"
									label={t('resources.image.form.file')}
									errors={errors.resource?.url}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										e.target.files && setFile(e.target.files[0])
									}
								/>
								<ProgressBar progress={uploadProgress} />
							</>
						) : (
							<InputGroup
								label={t('resources.image.form.url')}
								errors={errors.resource?.url}
								{...register('resource.url', { required: false })}
							/>
						)}
					</>
				);
			case RESOURCE_TYPE.FILE:
				return (
					<>
						<InputGroup
							type="file"
							label={t('resources.file.form.file')}
							errors={errors.resource?.url}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								e.target.files && setFile(e.target.files[0])
							}
						/>
						<ProgressBar progress={uploadProgress} />
					</>
				);
		}
	};

	/**
	 * Renders the first page of the menu. Used to select the type of
	 * resource to create
	 * @returns The first page of the menu
	 * @author Enric Soldevila
	 */
	const renderPageResourceType = () => {
		return (
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				{Object.entries(RESOURCE_TYPE).map((entry, idx) => (
					<TypeCard
						key={idx}
						title={t(`resources.${entry[0].toLowerCase()}.name`)}
						icon={getResourceIcon(entry[1])}
						onClick={() => onSelectResourceType(entry[1])}
						selected={type === entry[1]}
					/>
				))}
			</div>
		);
	};

	/**
	 * Renders the generic inputs and labels of a resource.
	 * (Also calls the renderSpecificFields method)
	 * @returns Rendered second page of menu
	 * @author Enric Soldevila
	 */
	const renderPageResourceInfos = () => {
		return (
			<div className="tablet:px-8 laptop:px-16 desktop:px-36">
				<InputGroup
					label={t('resources.form.name')}
					errors={errors.resource?.name}
					{...register('resource.name', { required: true })}
				/>
				<InputGroup
					as="select"
					label={t('resources.form.subject')}
					errors={errors.resource?.subject}
					{...register('resource.subject', { required: true })}
				>
					{Object.entries(SUBJECTS).map((entry, idx) => (
						<option key={idx} value={entry[1]}>
							{t(`msg.subjects.${entry[0].toLowerCase()}`)}
						</option>
					))}
				</InputGroup>
				{renderSpecificFields()}
			</div>
		);
	};

	return (
		<MenuCreation
			title={
				updateMode ? t('resources.form.update') : t('resources.form.create')
			}
			submitIcon={updateMode ? faCheckCircle : undefined}
			setOpen={setOpen}
			open={open}
			onSubmit={() => handleSubmit(onSubmit)()}
			disabledPageIndex={!updateMode ? (!type ? 1 : undefined) : undefined}
		>
			{!updateMode && renderPageResourceType()}
			{renderPageResourceInfos()}
		</MenuCreation>
	);
};

export default MenuResourceCreation;
