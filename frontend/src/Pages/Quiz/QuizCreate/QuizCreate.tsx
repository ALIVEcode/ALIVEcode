import { Button, Card, Form } from "react-bootstrap";
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { QuizCategoryProps } from '../QuizCategory/Category';

const QuizCreate = (props: QuizCategoryProps) => {
	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="left"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Card>
					<Card.Body>
						<h1>Quiz Creator</h1>
						<Form>
							<Form.Group>
								<Form.Label>Quiz Category</Form.Label>
								<Form.Control as="select" aria-label="">
									<option value="1">One</option>
									<option value="2">Two</option>
									<option value="3">Three</option>
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Name</Form.Label>
								<Form.Control></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Description</Form.Label>
								<Form.Control as="textarea" rows={3}></Form.Control>
							</Form.Group>
							<Button variant="primary" type="submit">
								Create
							</Button>
							{
								// Should now redirect to the quiz category page to show the quiz has been created
							}
						</Form>
					</Card.Body>
				</Card>
			</CenteredContainer>
		</div>
	);
};

export default QuizCreate;