import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import { Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import AboutCard from '../../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Result } from '../../../Models/Social/result.entity';
import api from '../../../Models/api';

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 10% 0 10%;

	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const AccountPage = () => {
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { register, handleSubmit } = useForm();

	const onSubmit = async (image: { file: any }) => {
		let fileData = new FormData();
		fileData.append('image', image.file[0]);
		await axios.post('users/upload', fileData, {
			headers: {
				'Content-Type': image.file[0].type,
			},
		});
		window.location.reload();
	};
	return (
		<>
			<StyledCenteredContainer>
				<Row>
					<div className="col-md-6">
						<div className="pb-5">
							<CardContainer title="Profil">
								{!user ? (
									<FontAwesomeIcon icon={faSpinner} />
								) : (
									<>
										<Row>
											<AboutCard
												name={user.getDisplayName()}
												img={`http://localhost:8000/uploads/${user.getDisplayImage()}`}
											/>
										</Row>
										<Form onSubmit={handleSubmit(onSubmit)}>
											<Form.Row>
												<input
													type="file"
													{...register('file', { required: true })}
												/>
											</Form.Row>
											<Form.Row>
												<button type="submit">upload</button>
											</Form.Row>
										</Form>
									</>
								)}
							</CardContainer>
						</div>
					</div>
				</Row>
			</StyledCenteredContainer>
		</>
	);
};

export default AccountPage;

