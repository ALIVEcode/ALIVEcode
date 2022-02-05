import { SignUpProps, FormSignUpValues } from './signUpTypes';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { USER_TYPES } from '../../../Types/userTypes';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import Link from '../../../Components/UtilsComponents/Link/Link';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { User } from '../../../Models/User/user.entity';
import { setAccessToken } from '../../../Types/accessToken';
import { useTranslation } from 'react-i18next';
import HttpStatusCode from '../../../Types/http-errors';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import Button from '../../../Components/UtilsComponents/Buttons/Button';
import InputGroup from '../../../Components/UtilsComponents/InputGroup/InputGroup';

/**
 * Signup page that allows the user to register a new account
 *
 * @author MoSk3
 *
 */
const SignUp = ({ userType }: SignUpProps) => {
	const { setUser } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm();
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const alert = useAlert();
	const navigate = useNavigate();
	const location = useLocation();

	const onSignIn = async (formValues: FormSignUpValues) => {
		try {
			const url =
				userType === USER_TYPES.PROFESSOR
					? 'users/professors'
					: 'users/students';

			// Register the user in the database
			await axios.post(url, formValues);

			// Generate and return new accessToken
			const { accessToken } = (
				await axios.post('users/login', {
					email: formValues.email,
					password: formValues.password,
				})
			).data;

			setAccessToken(accessToken);

			const user = await User.loadUser();
			if (!user) {
				alert.error(t('error.signin_first_time'));
				return navigate(routes.non_auth.signin.path);
			}

			setUser(user);

			if (
				location.pathname === '/signin' ||
				location.pathname.toLowerCase().includes('signup')
			)
				navigate(routes.auth.dashboard.path);
			return alert.success(t('msg.auth.signup_success'));
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) return alert.error(t('error.unknown'));
			const statusCode = err.response?.status;

			if (statusCode === HttpStatusCode.CONFLICT) {
				if (err.response.data.message.includes('username'))
					return setError('name', { type: 'taken' });
				if (err.response.data.message.includes('email'))
					return setError('email', { type: 'taken' });
			}

			return alert.error(
				t('error.custom', { error: err.response.data.message }),
			);
		}
	};

	return (
		<FormContainer title={t('form.title.signup')}>
			<form onSubmit={handleSubmit(onSignIn)}>
				<InputGroup
					type="email"
					autoComplete="on"
					label={t('form.email.label')}
					placeholder={t('form.email.placeholder')}
					errors={errors.email}
					messages={{
						required: t('form.email.required'),
						taken: t('form.email.taken'),
					}}
					{...register('email', { required: true })}
				/>
				{userType === USER_TYPES.PROFESSOR ? (
					<div className="flex flex-row gap-3">
						<InputGroup
							label={t('form.firstName.label')}
							placeholder={t('form.firstName.placeholder')}
							autoComplete="on"
							errors={errors.firstName}
							messages={{
								required: t('form.firstName.required'),
							}}
							minLength={3}
							maxLength={25}
							{...register('firstName', {
								required: true,
								minLength: 3,
								maxLength: 25,
							})}
						/>
						<InputGroup
							label={t('form.lastName.label')}
							placeholder="Soldevila"
							autoComplete="on"
							errors={errors.lastName}
							messages={{
								required: t('form.lastName.required'),
							}}
							minLength={3}
							maxLength={25}
							{...register('lastName', {
								required: true,
								minLength: 3,
								maxLength: 25,
							})}
						/>
					</div>
				) : (
					<>
						<InputGroup
							label={t('form.name.label')}
							placeholder={t('form.name.placeholder')}
							errors={errors.name}
							messages={{
								required: t('form.name.required'),
								taken: t('form.name.taken'),
								pattern: t('form.name.pattern'),
							}}
							minLength={3}
							maxLength={20}
							{...register('name', {
								required: true,
								minLength: 3,
								maxLength: 20,
								pattern: /^[a-zA-Z0-9_]*$/,
							})}
						/>
						{/*
						<Form.Group>
							<Form.Label>{t('form.scholarity.label')}</Form.Label>
							<Form.Control
								placeholder={t('form.scholarity.placeholder')}
								autoComplete="on"
								{...register('scholarity', { required: true })}
							/>
							{errors.scholarity?.type === 'required' &&
								t('form.scholarity.required')}
						</Form.Group>
						*/}
					</>
				)}
				<InputGroup
					label={t('form.pwd.label')}
					type="password"
					placeholder={t('form.pwd.placeholder')}
					autoComplete="current-password"
					errors={errors.password}
					messages={{
						required: t('form.pwd.required'),
						pattern: t('form.pwd.pattern'),
					}}
					minLength={6}
					maxLength={32}
					{...register('password', {
						required: true,
						minLength: 6,
						maxLength: 32,
						pattern: /^[A-Za-z0-9!@#\\$&*~]*$/,
					})}
				/>
				<Button className="mt-4" variant="third" type="submit">
					{t('msg.auth.signup')}
				</Button>
				<br />
				<br />
				{t('msg.auth.already_registered')}{' '}
				<Link pale to="/signin">
					{t('msg.auth.signin')}
				</Link>
			</form>
		</FormContainer>
	);
};

export default SignUp;
