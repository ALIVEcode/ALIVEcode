import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import SmallCard from '../../../Components/UtilsComponents/Cards/SmallCard/SmallCard';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { plainToClass } from 'class-transformer';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';

const QuizHome = () => {
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			const data = await api.db.quiz.categories.all({});
			setCategories(data.map((d: any) => plainToClass(Category, d)));
		};
		getCategories();
	}, []);

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<CardContainer
					asRow
					style={{ marginBottom: '100px' }}
					title="Catégories de Quizzes"
				>
					{categories.map(category => {
						return (
							<SmallCard
								to={`/quiz/category/${category.id}`}
								title={category.name}
							/>
						);
					})}
				</CardContainer>
			</CenteredContainer>
		</div>
	);
};

export default QuizHome;