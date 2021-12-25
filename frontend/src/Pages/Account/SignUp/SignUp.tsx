import { SignUpProps, FormSignUpValues } from './signUpTypes';
import { Button, Form, Col, InputGroup } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { USER_TYPES } from '../../../Types/userTypes';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import Link from '../../../Components/UtilsComponents/Link/Link';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { User } from '../../../Models/User/user.entity';
import { useHistory } from 'react-router';
import { setAccessToken } from '../../../Types/accessToken';
import { useTranslation } from 'react-i18next';
import HttpStatusCode from '../../../Types/http-errors';
import useRoutes from '../../../state/hooks/useRoutes';

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
	const history = useHistory();

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
				return history.push(routes.non_auth.signin.path);
			}

			setUser(user);

			if (history.location.pathname === '/signin') history.push('/dashboard');
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
			<Form onSubmit={handleSubmit(onSignIn)}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>{t('form.email.label')}</Form.Label>
					<InputGroup hasValidation>
						<Form.Control
							type="email"
							autoComplete="on"
							placeholder={t('form.email.placeholder')}
							isInvalid={errors.email}
							{...register('email', { required: true })}
						/>
						<Form.Control.Feedback
							style={{ wordWrap: 'break-word' }}
							type="invalid"
						>
							{errors.email?.type === 'required' && t('form.email.required')}
							{errors.email?.type === 'taken' && t('form.email.taken')}
						</Form.Control.Feedback>
					</InputGroup>
					<Form.Text>{t('form.email.info')}</Form.Text>
				</Form.Group>
				{userType === USER_TYPES.PROFESSOR ? (
					<Form.Row>
						<Form.Group as={Col}>
							<Form.Label>{t('form.firstName.label')}</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									placeholder={t('form.firstName.placeholder')}
									autoComplete="on"
									isInvalid={errors.firstName}
									{...register('firstName', {
										required: true,
										minLength: 3,
										maxLength: 25,
									})}
								/>
								<Form.Control.Feedback
									style={{ wordWrap: 'break-word' }}
									type="invalid"
								>
									{errors.firstName?.type === 'required' &&
										t('form.firstName.required')}
									{errors.firstName?.type === 'minLength' &&
										t('form.error.minLength', { min: 3 })}
									{errors.firstName?.type === 'maxLength' &&
										t('form.error.maxLength', { max: 25 })}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Label>{t('form.lastName.label')}</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									placeholder="Soldevila"
									autoComplete="on"
									isInvalid={errors.lastName}
									{...register('lastName', {
										required: true,
										minLength: 3,
										maxLength: 25,
									})}
								/>
								<Form.Control.Feedback
									style={{ wordWrap: 'break-word' }}
									type="invalid"
								>
									{errors.lastName?.type === 'required' &&
										t('form.lastName.required')}
									{errors.lastName?.type === 'minLength' &&
										t('form.error.minLength', { min: 3 })}
									{errors.lastName?.type === 'maxLength' &&
										t('form.error.maxLength', { max: 25 })}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
					</Form.Row>
				) : (
					<>
						<Form.Group>
							<Form.Label>{t('form.name.label')}</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									isInvalid={errors.name}
									placeholder={t('form.name.placeholder')}
									{...register('name', {
										required: true,
										minLength: 3,
										maxLength: 20,
										pattern: /^[a-zA-Z0-9_]*$/,
									})}
								/>
								<Form.Control.Feedback
									style={{ wordWrap: 'break-word' }}
									type="invalid"
								>
									{errors.name?.type === 'required' && t('form.name.required')}
									{errors.name?.type === 'taken' && t('form.name.taken')}
									{errors.name?.type === 'pattern' && t('form.name.pattern')}
									{errors.name?.type === 'minLength' &&
										t('form.error.minLength', { min: 3 })}
									{errors.name?.type === 'maxLength' &&
										t('form.error.maxLength', { max: 20 })}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
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
				<Form.Group>
					<Form.Label>{t('form.pwd.label')}</Form.Label>
					<InputGroup hasValidation>
						<Form.Control
							type="password"
							autoComplete="current-password"
							isInvalid={errors.password}
							placeholder={t('form.pwd.placeholder')}
							{...register('password', {
								required: true,
								minLength: 6,
								maxLength: 32,
								pattern: /^[A-Za-z0-9!@#\\$&*~]*$/,
							})}
						/>
						<Form.Control.Feedback
							style={{ wordWrap: 'break-word' }}
							type="invalid"
						>
							{errors.password?.type === 'required' && t('form.pwd.required')}
							{errors.password?.type === 'pattern' && t('form.pwd.pattern')}
							{errors.password?.type === 'minLength' &&
								t('form.error.minLength', { min: 6 })}
							{errors.password?.type === 'maxLength' &&
								t('form.error.maxLength', { max: 32 })}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>
				<Button variant="primary" type="submit">
					{t('msg.auth.signup')}
				</Button>
				<br />
				<br />
				{t('msg.auth.already_registered')}{' '}
				<Link pale to="/signin">
					{t('msg.auth.signin')}
				</Link>
			</Form>
		</FormContainer>
	);
};

export default SignUp;