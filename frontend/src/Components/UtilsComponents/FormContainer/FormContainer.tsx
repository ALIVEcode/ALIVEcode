import { FormContainerProps } from './formContainerTypes';
import styled from 'styled-components';
import FillContainer from '../FillContainer/FillContainer';

const StyledCenteredContainer = styled.div`
	position: absolute;
	border-radius: 20px;
	background-color: var(--primary-color);
	box-shadow: 0px 15px 30px rgb(160, 160, 160);
	padding: 40px;
	color: white;
	width: 40%;
	max-height: 90%;
	overflow-y: auto;

	.title {
		font-size: 3em;
	}

	@media screen and (max-width: 1238px) {
		width: 50%;
	}

	@media screen and (max-width: 1076px) {
		width: 60%;
	}

	@media screen and (max-width: 900px) {
		width: 70%;
	}

	@media screen and (max-width: 700px) {
		width: 80%;
	}

	@media screen and (max-width: 500px) {
		width: 100%;
	}
`;

/**
 * Styled container containing a form (Can be seen in signin and signup)
 *
 * @param {React.ReactNode} children form to display
 * @param {string} title title of the container
 *
 * @author MoSk3
 */
const FormContainer = ({ children, title }: FormContainerProps) => {
	return (
		<FillContainer centered>
			<StyledCenteredContainer>
				<label className="title">{title}</label>
				{children}
			</StyledCenteredContainer>
		</FillContainer>
	);
};

export default FormContainer;