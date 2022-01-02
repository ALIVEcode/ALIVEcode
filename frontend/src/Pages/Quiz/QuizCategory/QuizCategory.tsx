import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { useParams } from 'react-router';

const QuizCategory = () => {
	const [category, setCategory] = useState<Category>();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (!id) return;
		const getCategory = async () => {
			const data = await api.db.quiz.categories.one({
				id,
			});
			setCategory(plainToClass(Category, data));
		};
		getCategory();
	}, [id]);

	const handleDelete = async (id: any) => {
		if (!id) return;
		const response = await api.db.quiz.delete({
			id,
		});
		if (response.status === 200) {
			window.location.reload();
		}
	};

	return (
		<div>
			<div className="p-4 bg-white">
				<div>
					<div className="text-2xl">{category?.name}</div>
				</div>
			</div>
			<Card>
				<Card.Title>
					<Container>
						<Row>
							<Col>{category?.quizzes.length} Quiz</Col>
							<Col></Col>
							<Col>
								<Link to="/quiz/create">
									<Button>Créer un Quiz</Button>
								</Link>
							</Col>
						</Row>
					</Container>
				</Card.Title>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Nom</th>
							<th> # de Questions</th>
						</tr>
					</thead>
					<tbody>
						{category?.quizzes.map(quiz => {
							return (
								<tr>
									<td>{quiz.name}</td>
									<td>{quiz.questions.length}</td>
									<td>
										<Link to={`/quiz/play/${quiz.id}`}>
											<Button>Play</Button>
										</Link>
									</td>
									<td>
										<Link to={`/quiz/edit/${quiz.id}`}>
											<Button>Edit</Button>
										</Link>
									</td>
									<td>
										<Button
											onClick={() => {
												handleDelete(quiz.id);
											}}
										>
											Delete
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Card>
		</div>
	);
};

export default QuizCategory;