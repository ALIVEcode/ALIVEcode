import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import {
	FormProps,
	FORM_ACTION,
	InputGroup as InputGroupModel,
	matches,
} from './formTypes';
import axios, { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { prettyField } from '../../../Types/formatting';
import InputGroup from '../InputGroup/InputGroup';

/**
 * Form used to create or alter a relation in the database that auto-generates the fields depending of the arguments.
 * The fields can contain enums, error handling and auto-traduction.
 *
 * @param {string} name name of the form (used for the auto-applied translations)
 * @param {string} url url pointing to where to make the request
 * @param {string} action action of the form ("PATCH", "DELETE", "POST")
 * @param {(res: AxiosResponse<any>) => void} onSubmit callback called when the form has been submitted and returns the axios response
 * @param {(formValues: any) => any} alterFormValues callback called right before making the request to alter the form values (return the new values in the callback)
 * @param {Array<InputGroup>} inputGroups input groups of the form (see the example below or the InputGroup typing for more details)
 * @param {boolean} disabled if the fields should be all disabled
 *
 * example of a component creating a course:
 * 	<Form
 * 	  name='create_course'
 *    url='url_where_to_make_the_request'
 * 	  action='POST'
 * 	  onSubmit={(newPlainCourse) => {
 * 			// res is the data object of the response object
 * 			const newCourse: Course = plainToClass(Course, newPlainCourse);
 *    }}
 * 		alterFormValues={(formValues) => {
 * 			// Modify the formValues as pleased and return them:
 * 			return {classId: '123', course: formValues};
 *    }}
 *		inputGroups={[
 *			{
 *				name: 'name',
 *				required: true,
 *				inputType: 'text',
 *				minLength: 3,
 *				maxLength: 25,
 *			},
 *			{
 *				name: 'description',
 *				inputType: 'textarea',
 *				maxLength: 200,
 *			},
 *			{
 *				name: 'subject',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_SUBJECT,
 *			},
 *			{
 *				name: 'access',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_ACCESS,
 *			},
 *			{
 *				name: 'difficulty',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_DIFFICULTY,
 *			},
 *    ]}
 * />
 *
 * @author Enric Soldevila
 */
const Form = (props: FormProps) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const alert = useAlert();

	const onFormSubmit = async (formValues: any) => {
		if (props.customSubmit) return props.customSubmit(formValues);

		if (props.alterFormValues) formValues = props.alterFormValues(formValues);
		if (process.env.DEBUG) console.log(formValues);
		try {
			let res;
			switch (props.action) {
				case FORM_ACTION.POST:
					res = await axios.post(props.url, formValues);
					break;
				case FORM_ACTION.PATCH:
					res = await axios.patch(props.url, formValues);
					break;
				case FORM_ACTION.DELETE:
					res = await axios.delete(props.url, formValues);
					break;
			}
			if (res && props.onSubmit) props.onSubmit(res);
		} catch (err) {
			const axiosError = err as AxiosError;
			switch (axiosError.response?.status) {
				case 500:
					return alert.error(t('error.500'));
				case 403:
					return alert.error(t('error.403'));
			}
		}
	};

	const renderFormInput = (g: InputGroupModel, idx: number) => {
		const placeholderValue = t([
			`form.${props.name}.${props.action}.${g.name}.placeholder`,
			`form.${props.name}.${g.name}.placeholder`,
			prettyField(g.name),
		]);

		const defaultInputOptions = {
			style: { paddingRight: 0 },
			key: idx,
			placeholder: placeholderValue,
			defaultValue: g.default,
			disabled: g.disabled != null ? g.disabled : props.disabled,
		};

		let registerOptions: any = {
			required: g.required,
			minLength: g.minLength,
			maxLength: g.maxLength,
		};
		if (g.customMatch) {
			registerOptions = {
				...registerOptions,
				pattern: {
					value: g.match,
				},
			};
		} else if (g.match) {
			registerOptions = {
				...registerOptions,
				pattern: {
					value: matches[g.match],
				},
			};
		}
		switch (g.inputType) {
			case 'select':
				return (
					<InputGroup
						label={t([
							`form.${props.name}.${props.action}.${g.name}.label`,
							`form.${props.name}.${g.name}.label`,
							prettyField(g.name),
						])}
						errors={errors[g.name]}
						messages={{
							required: t([
								`form.${props.name}.${props.action}.${g.name}.error.required`,
								`form.${props.name}.${g.name}.error.required`,
								'form.error.required',
							]),
							maxLength: t(
								[
									`form.${props.name}.${props.action}.${g.name}.error.maxLength`,
									`form.${props.name}.${g.name}.error.maxLength`,
									'form.error.maxLength',
								],
								{ max: g.maxLength },
							),
							minLength: t(
								[
									`form.${props.name}.${props.action}.${g.name}.error.minlength`,
									`form.${props.name}.${g.name}.error.minLength`,
									'form.error.minLength',
								],
								{ min: g.minLength },
							),
							pattern: t([
								`form.${props.name}.${props.action}.${g.name}.error.match`,
								`form.${props.name}.${g.name}.error.match`,
								`form.error.match.${g.match?.toLowerCase()}`,
								'form.error.match.name',
							]),
						}}
						{...defaultInputOptions}
						defaultValue={g.default ?? ''}
						as="select"
						{...register(g.name, registerOptions)}
					>
						<option value=""></option>
						{Array.isArray(g.selectOptions)
							? g.selectOptions?.map((opt: any, idx) => {
									if ('display' in opt && 'value' in opt) {
										return (
											<option key={g.name + idx} value={opt.value}>
												{opt.display}
											</option>
										);
									}
									return (
										<option key={g.name + idx} value={opt}>
											{opt}
										</option>
									);
							  })
							: Object.keys(g.selectOptions as { [key: string]: any })
									.filter(k => isNaN(Number(k)))
									.map((k, idx) => (
										<option
											key={g.name + idx}
											value={(g.selectOptions as { [key: string]: any })[k]}
										>
											{k.toLowerCase()}
										</option>
									))}
					</InputGroup>
				);
			default:
				return (
					<InputGroup
						label={t([
							`form.${props.name}.${props.action}.${g.name}.label`,
							`form.${props.name}.${g.name}.label`,
							prettyField(g.name),
						])}
						as={g.inputType === 'textarea' ? 'textarea' : undefined}
						errors={errors[g.name]}
						messages={{
							required: t([
								`form.${props.name}.${props.action}.${g.name}.error.required`,
								`form.${props.name}.${g.name}.error.required`,
								'form.error.required',
							]),
							maxLength: t(
								[
									`form.${props.name}.${props.action}.${g.name}.error.maxLength`,
									`form.${props.name}.${g.name}.error.maxLength`,
									'form.error.maxLength',
								],
								{ max: g.maxLength },
							),
							minLength: t(
								[
									`form.${props.name}.${props.action}.${g.name}.error.minlength`,
									`form.${props.name}.${g.name}.error.minLength`,
									'form.error.minLength',
								],
								{ min: g.minLength },
							),
							pattern: t([
								`form.${props.name}.${props.action}.${g.name}.error.match`,
								`form.${props.name}.${g.name}.error.match`,
								`form.error.match.${g.match?.toLowerCase()}`,
								'form.error.match.name',
							]),
						}}
						{...defaultInputOptions}
						type={g.inputType}
						{...register(g.name, registerOptions)}
					/>
				);
		}
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)}>
			{props.inputGroups.map((g, idx) => renderFormInput(g, idx))}
			<Button
				variant={props.action === FORM_ACTION.DELETE ? 'danger' : 'secondary'}
				type="submit"
				disabled={props.disabled}
			>
				{t(
					[
						`form.${props.name}.${props.action}.submit`,
						`form.${props.name}.submit`,
						`form.submit.${props.action}`,
					],
					{ name: prettyField(props.name) },
				)}
			</Button>
		</form>
	);
};

export default Form;
