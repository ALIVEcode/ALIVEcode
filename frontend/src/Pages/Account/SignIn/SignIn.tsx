import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { useAlert } from 'react-alert';
import { FormSignInValues, SignInProps } from './signInTypes';
import { UserContext } from '../../../state/contexts/UserContext';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import Button from '../../../Components/UtilsComponents/Buttons/Button';
import Link from '../../../Components/UtilsComponents/Link/Link';
import { useTranslation } from 'react-i18next';
import { User } from '../../../Models/User/user.entity';
import { setAccessToken } from '../../../Types/accessToken';
import useRoutes from '../../../state/hooks/useRoutes';
import HttpStatusCode from '../../../Types/http-errors';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import InputGroup from '../../../Components/UtilsComponents/InputGroup/InputGroup';

/**
 * Signin page that allows the user to connect to its account
 *
 * @author MoSk3
 *
 */
const SignIn = (props: SignInProps) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm();
	const { setUser } = useContext(UserContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const navigate = useNavigate();
	const location = useLocation();
	const alert = useAlert();

	const onSignIn = async (formValues: FormSignInValues) => {
		console.log(formValues);
		try {
			const { accessToken } = (await axios.post('users/login/', formValues))
				.data;
			if (!accessToken) return alert.error(t('error.unknown'));

			setAccessToken(accessToken);

			const user = await User.loadUser();
			if (!user) return alert.error(t('error.unknown'));

			setUser(user);

			if (location.pathname === '/signin') navigate(routes.auth.dashboard.path);
			return alert.success(t('msg.auth.signin_success'));
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) return alert.error(t('error.unknown'));

			const statusCode = err.response.status;
			if (statusCode === HttpStatusCode.BAD_REQUEST) {
				setError('email', { type: 'invalid' });
				setError('password', { type: 'invalid' });
				return alert.error(t('error.signin'));
			}

			return alert.error(
				t('error.custom', { error: err.response.data.message }),
			);
		}
	};

	return (
		<FormContainer title={t('form.title.signin')}>
			<form onSubmit={handleSubmit(onSignIn)}>
				<InputGroup
					label={t('form.email.label')}
					type="email"
					autoComplete="on"
					placeholder={t('form.email.placeholder')}
					errors={errors.email}
					messages={{
						required: t('form.email.required'),
						invalid: t('error.signin'),
					}}
					{...register('email', {
						required: {
							value: true,
							message: t('from.email.required'),
						},
					})}
				/>

				<InputGroup
					label={t('form.pwd.label')}
					type="password"
					autoComplete="on"
					errors={errors.password}
					placeholder={t('form.pwd.placeholder')}
					messages={{
						pattern: t('form.pwd.pattern'),
						invalid: t('error.signin'),
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
					{t('msg.auth.signin')}
				</Button>

				<br />
				<br />

				{t('home.navbar.msg.non_auth.label')}
				<Link pale to="/signup">
					{t('msg.auth.signup')}
				</Link>
			</form>
		</FormContainer>
	);
};

export default SignIn;

/*

<div className={styles.main_div}>
			<Container fluid="sm">

			</Container>
		</div>

*/

/*

 <div id='main-div' class="container-fluid" style="position: relative; max-width: 100%;">
		<form action="" method="POST">
				{% csrf_token %}
				<h1>Connexion</h1>
				<br>
				{% if messages %}
				{% for message in messages %}
				{% if message.tags == 'success'%}
				<div class="alert alert-success">{{message}}</div>
				{% elif message.tags == 'error'%}
				<div class="alert alert-warning">{{message}}</div>
				{% endif %}
				{% endfor %}
				{% endif %}
				<div class="form-group">
						<label for="exampleInputEmail1">Adresse courriel</label><br>
						<input type="text" name="email" placeholder="Email" class="form-control" required>
				</div>
				<div class="form-group">
						<label for="exampleInputPassword1">Mot de passe</label><br>
						<input type="password" name="password" placeholder="*****" class="form-control" required>
				</div>
				<button type="submit" id="button-submit" class="btn btn-primary">Connexion</button>
				<br><br>
				<label>Vous n'avez pas de compte? <a
								href="{% url 'home:register' %}{% if request.GET.next is not None %}?next={{ request.GET.next }}{% endif %}">S'inscrire</a></label>
		</form>
</div>

*/
