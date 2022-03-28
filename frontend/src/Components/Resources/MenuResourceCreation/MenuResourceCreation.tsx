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
import Button from '../../UtilsComponents/Buttons/Button';
import { v4 as uuid } from 'uuid';

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
	const [file, setFile] = useState<File>();
	const [reqUuid, setReqUuid] = useState<string>();
	const [reqPath, setReqPath] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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

	console.log(defaultValues);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<MenuResourceCreationDTO>({
		defaultValues,
	});

	const updateUserChallenges = async () => {
		if (!user) return;
		setChallenges(await api.db.users.getChallenges({ id: user?.id }));
	};

	useEffect(() => {
		if (type === RESOURCE_TYPE.CHALLENGE) updateUserChallenges();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!resources) return <LoadingScreen></LoadingScreen>;

	const onSelectSubject = async (newType: RESOURCE_TYPE) => {
		if (type === newType) return setType(undefined);
		if (newType === RESOURCE_TYPE.CHALLENGE) updateUserChallenges();
		setType(newType);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = async (formValues: MenuResourceCreationDTO) => {
		if (!type) return;

		if (type === RESOURCE_TYPE.IMAGE) {
			if (reqUuid) formValues.uuid = reqUuid;
			if (reqPath) formValues.resource.url = reqPath;
		}
		formValues.type = type;
		if (updateMode && defaultResource) {
			const updatedRes = await api.db.resources.update(
				defaultResource,
				formValues.resource,
			);
			setResources(
				resources.map(r => (r.id === updatedRes.id ? updatedRes : r)),
			);
		} else {
			const resource = await api.db.resources.create(formValues);
			setResources([...resources, resource]);
		}
		setOpen(false);
	};

	const handleUpload = async () => {
		if (!file) return;
		const id = uuid();
		const formdata = new FormData();
		formdata.append('uuid', id);
		formdata.append('file', file);
		setReqUuid(id);
		const data = await api.db.resources.uploadImage(formdata, setUploadProgress);
		setReqPath(data.filename);
	};

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
					<InputGroup
						label={t('resources.video.form.url')}
						errors={errors.resource?.url}
						{...register('resource.url', { required: true })}
					/>
				);
			case RESOURCE_TYPE.IMAGE:
				return (
					<>
						<InputGroup
							type="file"
							label={t('resources.image.form.url')}
							errors={errors.resource?.url}
							onChange={(e: any) =>
								e.target.files && setFile(e.target.files[0])
							} // TODO any -> React.SyntheticEvent?
						/>
						<Button variant="primary" onClick={handleUpload}>
							upload
						</Button>
            <label htmlFor="uploadProgress">{uploadProgress}</label>
            <progress id="uploadProgress" max="100" value={uploadProgress} />
					</>
				);
			case RESOURCE_TYPE.FILE:
				return <></>;
		}
	};

	const renderPageResourceType = () => {
		return (
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				{Object.entries(RESOURCE_TYPE).map((entry, idx) => (
					<TypeCard
						key={idx}
						title={t(`resources.${entry[0].toLowerCase()}.name`)}
						icon={getResourceIcon(entry[1])}
						onClick={() => onSelectSubject(entry[1])}
						selected={type === entry[1]}
					/>
				))}
			</div>
		);
	};

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
