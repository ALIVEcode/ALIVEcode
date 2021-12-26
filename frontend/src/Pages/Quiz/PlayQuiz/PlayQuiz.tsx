import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import api from '../../../Models/api';
import { Quiz } from '../../../Models/Quiz/quiz.entity';
import { QuizCategoryProps } from '../QuizCategory/Category';

const PlayQuiz = (props: QuizCategoryProps) => {
	const [quiz, setQuiz] = useState<Quiz>();
	const [score, setScore] = useState(0);

	useEffect(() => {
		async function getQuiz() {
			const quiz = await api.db.quiz.one({ id: props.match.params.id });
			console.log(quiz);
			setQuiz(quiz);
		}
		getQuiz();
	}, [props.match.params.id]);

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
							<Card>
								<Card.Body>
									<Card.Title>{question.name}</Card.Title>
									<Card.Text>
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
														<Button onClick={btnClick}>{answer.value}</Button>
													</div>
												);
											})
										}
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
					);
				})
			}
		</div>
	);
};
export default PlayQuiz;