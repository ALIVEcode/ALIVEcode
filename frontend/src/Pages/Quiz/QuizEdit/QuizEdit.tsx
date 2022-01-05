import { plainToClass } from 'class-transformer';
import { useState, useEffect } from 'react';
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
import InputGroup from '../../../Components/UtilsComponents/InputGroup/InputGroup';
import Button from '../../../Components/UtilsComponents/Button/Button';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';

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
			setCategories(data);
		};
		const getQuiz = async () => {
			const response = await api.db.quiz.one({ id });
			setQuiz(response);
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

	console.log(categories);

	return (
		<FormContainer title="Edit your Quiz">
			<div>
				<div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputGroup
							label="Quiz Category"
							as="select"
							aria-label=""
							defaultValue={quiz?.category.id ?? ''}
							{...register('category.id')}
						>
							<option value=""></option>
							{categories.map((category, idx) => (
								<option key={idx} value={category.id}>
									{category.name}
								</option>
							))}
						</InputGroup>
						<InputGroup
							label="Quiz Name"
							defaultValue={quiz?.name}
							{...register('name')}
						></InputGroup>
						<InputGroup
							label="Quiz Description"
							as="textarea"
							rows={5}
							defaultValue={quiz?.description}
							{...register('description')}
						/>
						<Button variant="third" type="submit">
							Update!
						</Button>
						<br />
						<br />
						{
							// Should now redirect to the quiz category page to show the quiz has been updated
						}
					</form>
					<form onSubmit={handleSubmitQuestion(onSubmitNewQuestion)}>
						<InputGroup
							label="Question"
							as="textarea"
							rows={3}
							{...registerQuestion('name')}
						/>
						<Button variant="third" type="button">
							Ajouter une Question!
						</Button>
					</form>
					<form onSubmit={handleSubmitAnswer(onSubmitNewAnswer)}>
						<br />
						<InputGroup
							label="Response: "
							type="checkbox"
							{...registerAnswer('is_good')}
						/>
						<InputGroup
							label="Response: "
							as="textarea"
							{...registerAnswer('value')}
						/>
						<InputGroup
							label="Question"
							as="select"
							aria-label=""
							{...registerAnswer('question.id')}
						>
							<option></option>
							{quiz?.questions.map((question, idx) => (
								<option key={idx} value={question.id}>
									{question.name}
								</option>
							))}
						</InputGroup>
						<Button variant="third" type="submit">
							Ajouter une Réponse!
						</Button>
					</form>
				</div>
			</div>
			{quiz?.questions.map(question => {
				return (
					<div>
						<br />
						<div>
							<div>
								<p>{question.name}</p>
								<br />
								<Button
									variant="danger"
									onClick={() => {
										handleDeleteQuestion(question.id);
									}}
								>
									Delete
								</Button>
								<table>
									<tbody>
										{question.answers.map((answer, idx) => (
											<tr key={idx}>
												<td>{answer.value}</td>
												<td>{String(answer.is_good)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<br />
					</div>
				);
			})}
		</FormContainer>
	);
};

export default QuizEdit;
