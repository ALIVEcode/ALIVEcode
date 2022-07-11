import { TFunction } from 'i18next';

export const prettyField = (field: string) => {
	return field
		.split(' ')
		.map(t => t.substring(0, 1).toUpperCase() + t.substring(1))
		.join(' ');
};

type formatDateOptions = {
	hideTime?: boolean;
	hideDay?: boolean;
};

export const formatDate = (
	date: Date,
	t: TFunction,
	options?: formatDateOptions,
) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const dayOfWeek = date.getDay();
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();

	const replaceObj = {
		dayName: t(`msg.time.day.${dayOfWeek.toString()}`),
		monthName: t(`msg.time.month.${month.toString()}`),
		day,
		hour,
		minute: minute <= 9 ? `0${minute}` : minute,
		year,
	};

	if (options?.hideTime && options?.hideDay)
		return t('msg.time.format_no_time_and_day', replaceObj);
	if (options?.hideTime) return t('msg.time.format_no_time', replaceObj);
	if (options?.hideDay) return t('msg.time.format_no_day', replaceObj);

	return t('msg.time.format', replaceObj);
};

export const formatTooLong = (text: string, maxLength: number = 20) => {
	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
