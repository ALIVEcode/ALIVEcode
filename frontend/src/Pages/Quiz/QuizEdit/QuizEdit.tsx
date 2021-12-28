import { plainToClass } from "class-transformer";
import { useState, useEffect } from "react";
import { Card, Form, Button, Table } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { Quiz } from '../../../Models/Quiz/quiz.entity';
import { QuizForm } from '../../../Models/Quiz/quizForm.entity';
import { useParams } from 'react-router';
import { QuestionForm } from '../../../Models/Quiz/questionForm.entity';
import { Answer } from '../../../Models/Quiz/answer.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';

const QuizEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { routes } = useRoutes();

	const updateQuiz = async (data: QuizForm) => {
		if (!id) return;
		await api.db.quiz.update(
			{
				id,
			},
			data,
		);
		navigate(
			routes.public.quiz_category.path.replace(
				':id',
				data.category.id.toString(),
			),
		);
	};

	const createQuestion = async (data: QuestionForm) => {
		if (!id) return;
		const quizObj = {
			id,
		};
		data.quiz = quizObj;
		await api.db.question.create(data);
		window.location.reload();
	};

	const createAnswer = async (data: Answer) => {
		await api.db.answer.create(data);
		window.location.reload();
	};

	const [categories, setCategories] = useState<Category[]>([]);
	const [quiz, setQuiz] = useState<Quiz>();

	const { register, handleSubmit } = useForm<QuizForm>();
	const { register: registerQuestion, handleSubmit: handleSubmitQuestion } =
		useForm<QuestionForm>();

	const { register: registerAnswer, handleSubmit: handleSubmitAnswer } =
		useForm<Answer>();
	const onSubmit: SubmitHandler<Quiz> = data => updateQuiz(data);
	const onSubmitNewQuestion: SubmitHandler<QuestionForm> = data =>
		createQuestion(data);
	const onSubmitNewAnswer: SubmitHandler<Answer> = data => createAnswer(data);

	useEffect(() => {
		if (!id) return;
		const getCategories = async () => {
			const data = await api.db.quiz.categories.all({});
			setCategories(data.map((d: any) => plainToClass(Category, d)));
		};
		const getQuiz = async () => {
			const response = await api.db.quiz.one({ id });
			setQuiz(plainToClass(Quiz, response));
		};
		getCategories();
		getQuiz();
	}, [id]);

	async function handleDeleteQuestion(id: any) {
		const response = await api.db.question.delete({
			id,
		});
		if (response.status === 200) {
			window.location.reload();
		}
	}

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="left"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Card>
					<Card.Body>
						<h1>Edit your Quiz!</h1>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group>
								<Form.Label>Quiz Category</Form.Label>
								<Form.Control
									as="select"
									aria-label=""
									{...register('category.id')}
								>
									<option></option>
									{categories.map(category => {
										return <option value={category.id}>{category.name}</option>;
									})}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Name</Form.Label>
								<Form.Control {...register('name')}></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Description</Form.Label>
								<Form.Control
									as="textarea"
									rows={5}
									{...register('description')}
								></Form.Control>
							</Form.Group>
							<Button variant="primary" type="submit">
								Update!
							</Button>
							<br />
							<br />
							{
								// Should now redirect to the quiz category page to show the quiz has been updated
							}
						</Form>
						<Form onSubmit={handleSubmitQuestion(onSubmitNewQuestion)}>
							<Form.Group>
								<Form.Label>Question</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									{...registerQuestion('name')}
								></Form.Control>
							</Form.Group>
							<Button type="button">Ajouter une Question!</Button>
						</Form>
						<Form onSubmit={handleSubmitAnswer(onSubmitNewAnswer)}>
							<br />
							<Form.Label>Réponse: </Form.Label>
							<Form.Control
								type="checkbox"
								{...registerAnswer('is_good')}
							></Form.Control>
							<Form.Control
								as="textarea"
								rows={2}
								{...registerAnswer('value')}
							></Form.Control>
							<Form.Group>
								<Form.Label>Question</Form.Label>
								<Form.Control
									as="select"
									aria-label=""
									{...registerAnswer('question.id')}
								>
									<option></option>
									{quiz?.questions.map(question => {
										return <option value={question.id}>{question.name}</option>;
									})}
								</Form.Control>
							</Form.Group>
							<Button type="submit">Ajouter une Réponse!</Button>
						</Form>
					</Card.Body>
				</Card>
				{quiz?.questions.map(question => {
					return (
						<div>
							<br />
							<Card>
								<Card.Body>
									<p>{question.name}</p>
									<br />
									<Button
										onClick={() => {
											handleDeleteQuestion(question.id);
										}}
									>
										Delete
									</Button>
									<Table>
										<tbody>
											{question.answers.map((answer, idx) => (
												<tr key={idx}>
													<td>{answer.value}</td>
													<td>{String(answer.is_good)}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Card.Body>
							</Card>
							<br />
						</div>
					);
				})}
			</CenteredContainer>
		</div>
	);
};

export default QuizEdit;