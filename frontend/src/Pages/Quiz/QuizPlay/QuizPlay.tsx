import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { Quiz } from '../../../Models/Quiz/quiz.entity';
import { useParams } from 'react-router';
import Button from '../../../Components/UtilsComponents/Buttons/Button';

const QuizPlay = () => {
	const [quiz, setQuiz] = useState<Quiz>();
	const [score, setScore] = useState(0);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const getQuiz = async () => {
			if (!id) return;
			const quiz = await api.db.quiz.one({ id });
			setQuiz(quiz);
		};
		getQuiz();
	}, [id]);

	return (
		<div className="container centered">
			<h1>{quiz?.name}</h1>
			<p>{quiz?.description}</p>
			<p>Current score: {score}</p>

			{
				/* Generate all questions in cards form */
				quiz?.questions.map(question => {
					return (
						<div>
							<div>
								<div>
									<div className="text-xl">{question.name}</div>
									<div className="text-base">
										{
											/* Generate possibles answers as buttons */
											question.answers.map(answer => {
												function btnClick() {
													if (Boolean(answer.is_good) === true) {
														setScore(score + 1);
													}
												}
												return (
													<div>
														<br />
														<Button variant="third" onClick={btnClick}>
															{answer.value}
														</Button>
													</div>
												);
											})
										}
									</div>
								</div>
							</div>
						</div>
					);
				})
			}
		</div>
	);
};
export default QuizPlay;
