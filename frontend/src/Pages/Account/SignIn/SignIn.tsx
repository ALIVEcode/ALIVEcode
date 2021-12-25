import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { useAlert } from 'react-alert';
import { FormSignInValues, SignInProps } from './signInTypes';
import { useHistory } from 'react-router';
import { UserContext } from '../../../state/contexts/UserContext';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import { Form, InputGroup } from 'react-bootstrap';
import Button from '../../../Components/UtilsComponents/Button/Button';
import Link from '../../../Components/UtilsComponents/Link/Link';
import { useTranslation } from 'react-i18next';
import { User } from '../../../Models/User/user.entity';
import { setAccessToken } from '../../../Types/accessToken';
import useRoutes from '../../../state/hooks/useRoutes';
import HttpStatusCode from '../../../Types/http-errors';

/** 
 * Signin page that allows the user to connect to its account
 * 
 * @author MoSk3
 * 
*/
const SignIn = (props: SignInProps) => {
	const { register, handleSubmit, setError, formState: { errors } } = useForm();
	const { setUser } = useContext(UserContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const history = useHistory();
	const alert = useAlert();

	const onSignIn = async (formValues: FormSignInValues) => {
		try {
			const { accessToken } = (await axios.post('users/login/', formValues)).data;
			if (!accessToken) return alert.error(t('error.unknown'))

			setAccessToken(accessToken);

			const user = await User.loadUser();
			if(!user) return alert.error(t('error.unknown'));

			setUser(user);

			if(history.location.pathname === '/signin') history.push(routes.auth.dashboard.path);
			return alert.success(t('msg.auth.signin_success'));

		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) return alert.error(t('error.unknown'));

			const statusCode = err.response.status;
			if(statusCode === HttpStatusCode.BAD_REQUEST) {
				setError('email', { type: 'invalid' });
				setError('password', { type: 'invalid' });
				return alert.error(t('error.signin'))
			}

			return alert.error(t('error.custom', { error: err.response.data.message }));
		}
	};

	return (
		<FormContainer title={t('form.title.signin')}>
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
							{errors.email?.type === 'invalid' && t('error.signin')}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>{t('form.pwd.label')}</Form.Label>
					<InputGroup hasValidation>
						<Form.Control
							type="password"
							autoComplete="on"
							isInvalid={errors.password}
							placeholder={t('form.pwd.placeholder')}
							{...register('password', { required: true, minLength: 6, maxLength: 32, pattern: /^[A-Za-z0-9!@#\\$&*~]*$/,})}
						/>
						<Form.Control.Feedback
							style={{ wordWrap: 'break-word' }}
							type="invalid"
						>
							{errors.password?.type === 'required' && t('form.pwd.required')}
							{errors.password?.type === 'pattern' && t('form.pwd.pattern')}
							{errors.password?.type === 'minLength' && t('form.error.minLength', { min: 6})}
							{errors.password?.type === 'maxLength' && t('form.error.maxLength', { max: 32 })}
							{errors.password?.type === 'invalid' && t('error.signin')}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>
				<Button variant="primary" type="submit">
					{t('msg.auth.signin')}
				</Button>

				<br /><br />

				{t('home.navbar.msg.non_auth.label')}<Link pale to="/signup">{t('msg.auth.signup')}</Link>
			</Form>
		</FormContainer>
	);
}

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