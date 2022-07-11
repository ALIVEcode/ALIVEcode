import { Transform } from 'class-transformer';
import { SUBJECTS } from '../../Types/sharedTypes';
import { TFunction } from 'i18next';
import i18next from 'i18next';

const formatDateStringToDate = (val: string) => {
	const lst = val.split('-');
	const year = Number(lst[0]);
	const month = Number(lst[1]);
	const date = Number(lst[2]);
	const dateObj = new Date();
	dateObj.setMonth(month - 1);
	dateObj.setFullYear(year);
	dateObj.setDate(date);
	return dateObj;
};

export class ShowcaseProject {
	nameId: string;

	private name: {
		fr: string;
		en: string;
	};

	private description: {
		fr: string;
		en: string;
	};

	subject: SUBJECTS;

	contributors: string[];

	imgSrc?: string;

	videoUrl?: string;

	learnMoreUrl?: string;

	ongoing?: boolean;

	@Transform(({ value }) => {
		console.log(value);
		if (typeof value !== 'string') {
			throw new Error(
				'Start date from showcase project is not set or is invalid',
			);
		}
		return formatDateStringToDate(value);
	})
	startDate: Date;

	@Transform(({ value }) => {
		if (typeof value !== 'string') return undefined;
		return formatDateStringToDate(value);
	})
	finishDate?: Date;

	getName(t: TFunction) {
		const names = Object.values(this.name);
		if (names.length === 0) return t('showcase.project.no_name');
		const language = i18next.language;
		if (language in this.name) {
			return (this.name as any)[language];
		}
		return names[0];
	}

	getDescription(t: TFunction) {
		const descriptions = Object.values(this.description);
		if (descriptions.length === 0) return t('showcase.project.no_description');
		const language = i18next.language;
		if (language in this.description) {
			return (this.description as any)[language];
		}
		return descriptions[0];
	}
}
