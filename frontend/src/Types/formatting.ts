import { TFunction } from "i18next";

export const prettyField = (field: string) => {
	return field
		.split(' ')
		.map(t => t.substring(0, 1).toUpperCase() + t.substring(1))
		.join(' ');
};

export const formatDate = (date: Date, t: TFunction) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const dayOfWeek = date.getDay();
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();

	return t('msg.time.format', {
		dayName: t(`msg.time.day.${dayOfWeek.toString()}`),
		monthName: t(`msg.time.month.${month.toString()}`),
		day,
		hour,
		minute: minute <= 9 ? `0${minute}` : minute,
		year,
	});
};

export const formatTooLong = (text: string, maxLength: number = 20) => {
	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};