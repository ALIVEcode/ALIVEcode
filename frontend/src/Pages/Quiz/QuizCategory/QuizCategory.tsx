import { plainToClass } from 'class-transformer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { useParams } from 'react-router';
import Button from '../../../Components/UtilsComponents/Button/Button';

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
		<div className="h-full">
			<div className="p-4 bg-[color:var(--background-color)] border-b border-[color:var(--bg-shade-four-color)]">
				<div>
					<div className="text-2xl">{category?.name}</div>
				</div>
			</div>
			<div className="flex flex-col justify-center p-4 gap-4">
				<div className="w-full flex flex-col">
					<div>{category?.quizzes.length} Quiz</div>
					<div>
						<Link to="/quiz/create">
							<Button variant="primary">Créer un Quiz</Button>
						</Link>
					</div>
				</div>
				<table>
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
											<Button variant="third">Play</Button>
										</Link>
									</td>
									<td>
										<Link to={`/quiz/edit/${quiz.id}`}>
											<Button variant="secondary">Edit</Button>
										</Link>
									</td>
									<td>
										<Button
											variant="danger"
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
				</table>
			</div>
		</div>
	);
};

export default QuizCategory;
