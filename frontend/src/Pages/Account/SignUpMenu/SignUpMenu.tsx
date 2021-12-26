import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { SignUpMenuProps } from './signUpMenuTypes';
import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import { Row } from 'react-bootstrap';

import StudentImg from '../../../assets/images/icons/student.png';
import ProfessorImg from '../../../assets/images/icons/teacher.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Page that gives the option to signup as a student or as a professor
 *
 * @author MoSk3
 */
const SignUpMenu = (props: SignUpMenuProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer startAtTop centered>
			<Row style={{ justifyContent: 'center' }}>
				<Card
					img={StudentImg}
					to={routes.non_auth.signup_student.path}
					title={t('menu.signup.student')}
				/>
				<Card
					img={ProfessorImg}
					to={routes.non_auth.signup_professor.path}
					title={t('menu.signup.professor')}
				/>
			</Row>
		</FillContainer>
	);
};

export default SignUpMenu;