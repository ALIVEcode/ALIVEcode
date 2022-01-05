import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { Post } from '../../../Models/Forum/post.entity';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { plainToClass } from 'class-transformer';
import api from '../../../Models/api';
import { CategorySubject } from '../../../Models/Forum/categorySubject.entity';
import { Subject } from '../../../Models/Forum/subjects.entity';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserContext } from '../../../state/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/UtilsComponents/Button/Button';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import InputGroup from '../../../Components/UtilsComponents/InputGroup/InputGroup';

const ForumPostForm = () => {
	const [categories, setCategories] = useState<CategorySubject[]>([]);
	const [subject, setSubject] = useState<Subject[]>([]);
	const [chosenCategoryId, setChosenCategoryId] = useState<string>();
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	//get tous les champs du forum
	const { register, handleSubmit } = useForm();
	const onSubmit: SubmitHandler<any> = data => sendForm(data);

	useEffect(() => {
		const getCategory = async () => {
			const data = await api.db.forum.categories.get({});
			setCategories(data.map((d: any) => plainToClass(CategorySubject, d)));
		};
		getCategory();
	}, []);

	useEffect(() => {
		const getSubject = async () => {
			if (chosenCategoryId) {
				const data = await api.db.forum.categories.getById({
					id: chosenCategoryId,
				});
				const subjectdata = data.subjects;
				setSubject(subjectdata.map((d: any) => plainToClass(Subject, d)));
			}
		};
		getSubject();
	}, [chosenCategoryId]);

	async function sendForm(data: Post) {
		const date = new Date();
		let string = date.toString();
		string = string.substring(0, 24);
		data.created_at = string;

		if (user) {
			data.creator = user;
		}

		const response = await api.db.forum.createQuestion(data);
		if (response) {
			navigate('/forum');
		}
	}

	return (
		<FormContainer title="Formulaire : ">
			<form style={{ width: '30rem' }} onSubmit={handleSubmit(onSubmit)}>
				<InputGroup label="Title" {...register('title')} />
				<InputGroup
					label="Description"
					as="textarea"
					rows={7}
					{...register('content')}
				/>
				<InputGroup
					label="Category"
					as="select"
					onChange={(e: any) => setChosenCategoryId(e.target.value)}
				>
					<option value=""></option>
					{categories.map(c => (
						<option value={c.id} key={c.id}>
							{c.name}
						</option>
					))}
				</InputGroup>

				{chosenCategoryId && (
					<InputGroup label="Subject" as="select" {...register('subject.id')}>
						<option value=""></option>
						{subject.map(s => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</InputGroup>
				)}

				<Button variant="third" type="submit">
					Envoyer
				</Button>
			</form>
		</FormContainer>
	);
};

export default ForumPostForm;
