import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
	getResourceColor,
	getResourceIcon,
	RESOURCE_TYPE,
} from '../../../Models/Resource/resource.entity';
import { Challenge } from '../../../Models/Challenge/challenge.entity';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import useRoutes from '../../../state/hooks/useRoutes';
import { instanceToPlain } from 'class-transformer';
import { useForm } from 'react-hook-form';
import {
	MenuResourceCreationDTO,
	MenuResourceCreationProps,
} from './menuResourceCreationTypes';
import api from '../../../Models/api';
import FormLabel from '../../UtilsComponents/FormLabel/FormLabel';
import Link from '../../UtilsComponents/Link/Link';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { SUBJECTS } from '../../../Types/sharedTypes';
import Button from '../../UtilsComponents/Buttons/Button';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import useComplexState from '../../../state/hooks/useComplexState';
import Timeline from '../../UtilsComponents/Modal/Timeline';
import ResourceTheoryDocument from '../ResourceTheoryDocument/ResourceTheoryDocument';

/**
 * @description renders the menu for creating a resource of the given type
 * @param mode the mode of the menu (modal to open in standalone mode and form to integrate in another component)
 * @param open boolean to open or close the menu
 * @param setOpen the function to close the menu
 * @param afterSubmit the function to call after the creation of the resource
 * @param updateMode if the menu is to update an existing resource or to create a new one
 * @param defaultResource the default resource to fill the form with
 * @constructor
 *
 * @author Mathis Laroche
 */
const MenuResourceCreation = ({
	mode = 'modal',
	open,
	setOpen,
	afterSubmit,
	updateMode,
	defaultResource,
}: MenuResourceCreationProps) => {
	const [type, setType] = useState<RESOURCE_TYPE | undefined>(
		defaultResource?.type ?? undefined,
	);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [resourceIsFile, setResourceIsFile] = useState<boolean>(
		defaultResource?.isFile() ?? false,
	);
	const forceUpdate = useForceUpdate();

	const { t } = useTranslation();
	const { user, createResource, updateResource } = useContext(UserContext);
	const { routes } = useRoutes();
	const [defaultValues, setDefaultValues] = useComplexState({
		type,
		resource: instanceToPlain(defaultResource),
	});

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
	const loadUserChallenges = useCallback(async () => {
		if (!user) return;
		setChallenges(await api.db.users.getChallenges({ id: user?.id }));
	}, [user]);

	/** Loads user challenges on first render */
	useEffect(() => {
		if (type === RESOURCE_TYPE.CHALLENGE)
			(async () => await loadUserChallenges)();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Handle the chosing of a new resource type for the resource creation.
	 * Loads the user challenges if it is a Challenge resource
	 * @param newType New resource type to create
	 * @author Enric Soldevila
	 */
	const onSelectResourceType = useCallback(
		async (newType: RESOURCE_TYPE) => {
			if (type === newType) return setType(undefined);
			if (newType === RESOURCE_TYPE.CHALLENGE) await loadUserChallenges();
			setType(newType);
		},
		[loadUserChallenges, type],
	);

	/**
	 * Handles the form submission. Sends data to the server to update
	 * or create a resource with all the properties chosen in the menu.
	 * @param formValues Form values returned by the form submission
	 * @author Enric Soldevila, Maxime Gazze
	 */
	const onSubmit = useCallback(
		async (formValues: MenuResourceCreationDTO) => {
			if (!type) return;
			formValues.type = type;

			if (resourceIsFile) formValues.file = file;

			if (updateMode && defaultResource) {
				setDefaultValues({
					type: defaultResource.type,
					resource: await updateResource(defaultResource, formValues.resource),
				});
			} else {
				const val = await createResource(formValues, setUploadProgress);
				setDefaultValues({ type: val.type, resource: val });
			}

			// reset
			setFile(null);
			setUploadProgress(0);
			setOpen && setOpen(false);
			afterSubmit && afterSubmit();
			forceUpdate();
		},
		[
			afterSubmit,
			createResource,
			defaultResource,
			file,
			forceUpdate,
			resourceIsFile,
			setDefaultValues,
			setOpen,
			type,
			updateMode,
			updateResource,
		],
	);

	const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value === 'file';
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
								// @ts-ignore
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
				if (updateMode && defaultResource)
					return (
						<ResourceTheoryDocument
							resource={defaultResource}
							editMode={true}
						/>
					);
				return <></>;
			case RESOURCE_TYPE.VIDEO:
				return updateMode ? (
					!resourceIsFile && (
						<InputGroup
							label={t('resources.video.form.url')}
							errors={errors.resource?.url}
							{...register('resource.url', { required: false })}
						/>
					)
				) : (
					<>
						<div onChange={onChangeRadio}>
							<input
								type="radio"
								name="resource"
								value="file"
								id="file"
								defaultChecked={resourceIsFile}
							/>
							<label htmlFor="file">file</label>
							<input
								type="radio"
								name="resource"
								value="url"
								id="url"
								defaultChecked={!resourceIsFile}
							/>
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
									progress={uploadProgress}
								/>
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
			case RESOURCE_TYPE.PDF:
				return updateMode ? (
					<></>
				) : (
					<>
						<InputGroup
							type="file"
							label={t('resources.pdf.form.file')}
							errors={errors.resource?.url}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								e.target.files && setFile(e.target.files[0])
							}
							progress={uploadProgress}
						/>
					</>
				);
			case RESOURCE_TYPE.FILE:
				return updateMode ? (
					<></>
				) : (
					<>
						<InputGroup
							type="file"
							label={t('resources.file.form.file')}
							errors={errors.resource?.url}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								e.target.files && setFile(e.target.files[0])
							}
							progress={uploadProgress}
						/>
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
				{Object.entries(RESOURCE_TYPE).map(([name, _type], idx) => (
					<TypeCard
						key={idx}
						title={t(`resources.${name.toLowerCase()}.name`)}
						tooltip={t(`help.resource.${name.toLowerCase()}`)}
						icon={getResourceIcon(_type)}
						color={getResourceColor(_type)}
						onClick={() => onSelectResourceType(_type)}
						selected={type === _type}
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
		<>
			{mode === 'modal' ? (
				<Timeline.Modal
					title={
						updateMode ? t('resources.form.update') : t('resources.form.create')
					}
					open={open!}
					setOpen={setOpen!}
					onSubmit={async () => {
						try {
							let r = true;
							const func = handleSubmit(onSubmit, () => {
								r = false;
							});
							await func();
							return r;
						} catch {
							return false;
						}
					}}
					submitText={
						updateMode ? t('resources.form.update') : t('resources.form.create')
					}
					submitButtonVariant="primary"
				>
					{!updateMode && (
						<Timeline.Page>{renderPageResourceType()}</Timeline.Page>
					)}
					<Timeline.Page>{renderPageResourceInfos()}</Timeline.Page>
				</Timeline.Modal>
			) : (
				/*<MenuCreation
					title={
						updateMode ? t('resources.form.update') : t('resources.form.create')
					}
					submitIcon={updateMode ? faCheckCircle : undefined}
					setOpen={setOpen!}
					open={open!}
					onSubmit={handleSubmit(onSubmit)}
					disabledPageIndex={!updateMode ? (!type ? 1 : undefined) : undefined}
				>
					{!updateMode && renderPageResourceType()}
					{renderPageResourceInfos()}
				</MenuCreation>*/
				<div className="flex flex-col justify-items-center">
					{!updateMode && renderPageResourceType()}
					{renderPageResourceInfos()}
					<Button
						variant="primary"
						className="mt-3 w-fit mr-4"
						onClick={handleSubmit(onSubmit)}
					>
						{t('resources.form.update')}
					</Button>
				</div>
			)}
		</>
	);
};

export default MenuResourceCreation;
