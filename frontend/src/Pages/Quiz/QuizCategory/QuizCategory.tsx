import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { QuizCategoryProps } from './Category';

const QuizCategory = (props: QuizCategoryProps) => {
	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Card>
					<Card.Body>
						{/*
                            Hardcoded text will be replaced once backend is ready 
                         */}
						<Card.Title>Pseudo Code </Card.Title>
						<Card.Text>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
							maiores vel, minima nemo neque incidunt? Excepturi ducimus
							accusantium est accusamus fugiat. Nulla atque iste impedit
							tenetur, optio libero recusandae ex.
						</Card.Text>
					</Card.Body>
				</Card>
				<Card>
					<Card.Title>
						<Container>
							<Row>
								<Col>15 Quiz</Col>
								<Col></Col>
								<Col>
									<Button>Ajouter un Quiz TODO</Button>
								</Col>
								<Col>
									<Form>
										<Form.Group>
											<Form.Control type="text" placeholder="Search" />
										</Form.Group>
									</Form>
								</Col>
							</Row>
						</Container>
					</Card.Title>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Validation</th>
								<th>Nom</th>
								<th> # de Questions</th>
								<th>Auteur</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Yes</td>
								<td>Les fonctions</td>
								<td>20</td>
								<td>Bob</td>
								<td>11-09-2021</td>
								<td>
									<Link
										to="/quiz/:id/create-question"
										className="btn btn-primary"
									>
										Add a Question
									</Link>
								</td>
							</tr>
							<tr>
								<td>Yes</td>
								<td>Les fonctions</td>
								<td>20</td>
								<td>Bob</td>
								<td>11-09-2021</td>
							</tr>
							<tr>
								<td>Yes</td>
								<td>Les fonctions</td>
								<td>20</td>
								<td>Bob</td>
								<td>11-09-2021</td>
							</tr>
						</tbody>
					</Table>
				</Card>
			</CenteredContainer>
		</div>
	);
};

export default QuizCategory;