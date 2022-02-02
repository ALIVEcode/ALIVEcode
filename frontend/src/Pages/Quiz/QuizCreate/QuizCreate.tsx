import { plainToClass } from 'class-transformer';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { Quiz } from '../../../Models/Quiz/quiz.entity';
import { QuizForm } from '../../../Models/Quiz/quizForm.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';
import InputGroup from '../../../Components/UtilsComponents/InputGroup/InputGroup';
import Button from '../../../Components/UtilsComponents/Buttons/Button';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';

const QuizCreate = () => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const [categories, setCategories] = useState<Category[]>([]);
	const { register, handleSubmit } = useForm<QuizForm>();
	const onSubmit: SubmitHandler<Quiz> = data => postQuiz(data);

	useEffect(() => {
		const getCategories = async () => {
			const data = await api.db.quiz.categories.all({});
			setCategories(data.map((d: any) => plainToClass(Category, d)));
		};
		getCategories();
	}, []);

	const postQuiz = async (data: QuizForm) => {
		await api.db.quiz.create(data);
		navigate(
			routes.public.quiz_category.path.replace(
				':id',
				data.category.id.toString(),
			),
		);
	};

	return (
		<FormContainer title="Create your Quiz">
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputGroup
					label="Quiz Category"
					as="select"
					aria-label=""
					{...register('category.id')}
				>
					<option></option>
					{categories.map(category => (
						<option value={category.id}>{category.name}</option>
					))}
				</InputGroup>
				<InputGroup label="Quiz Name" {...register('name')} />
				<InputGroup
					label="Quiz Description"
					as="textarea"
					rows={5}
					{...register('description')}
				/>
				<Button variant="third" type="submit">
					Create
				</Button>
				{
					// Should now redirect to the quiz category page to show the quiz has been created
				}
			</form>
		</FormContainer>
	);
};

export default QuizCreate;
