import { createContext } from 'react';

export type Theme = {
	color: {
		primary: string;
		primary_rgb: string;
		secondary: string;
		secondary_rgb: string;
		third: string;
		third_rgb: string;
		fourth: string;
		fourth_rgb: string;
		pale: string;
		pale_rgb: string;
		contrast: string;
		constrast_rgb: string;
		hover: string;
		background: string;
		background_rgb: string;
		background_hover: string;
		fg_shade_one: string;
		fg_shade_two: string;
		fg_shade_three: string;
		fg_shade_four: string;
		bg_shade_one: string;
		bg_shade_two: string;
		bg_shade_three: string;
		bg_shade_four: string;
		foreground: string;
		foreground_rgb: string;
		tableback: string;
		databack: string;
		headerAIBack: string;
	};
	background: string;
	name: string;
};

export const themes: { light: Theme; dark: Theme } = {
	light: {
		color: {
			primary: '#2E75FF',
			primary_rgb: '1,119,188',
			secondary: '#92B7FF',
			secondary_rgb: '146,183,255',
			third: '#04e6d3',
			third_rgb: '0,186,198',
			fourth: '#029FCA',
			fourth_rgb: '2,159,202',
			pale: '#D9F3FF',
			pale_rgb: '217,243,255',
			contrast: '#ffb013',
			constrast_rgb: '255,176,19',
			hover: '#00cbe6',
			background: '#ffffff',
			background_rgb: '255,255,255',
			background_hover: '#bfbfbf',
			bg_shade_one: '#f5f5f5',
			bg_shade_two: '#ebebeb',
			bg_shade_three: '#d9d9d9',
			bg_shade_four: '#bfbfbf',
			foreground: 'black',
			foreground_rgb: '0,0,0',
			fg_shade_one: '#3D3D3D',
			fg_shade_two: '#474747',
			fg_shade_three: '#525252',
			fg_shade_four: '#5C5C5C',
			tableback: '#9ecbff',
			databack: '#f2f2f2',
			headerAIBack:
				'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,9,121,1) 0%, rgba(0,96,171,1) 0%, rgba(0,168,255,1) 100%)',
		},
		background: '#ffffff',
		name: 'light',
	},
	dark: {
		color: {
			primary: '#02111D',
			primary_rgb: '2,17,29',
			secondary: '#2C394B',
			secondary_rgb: '44,57,75',
			third: '#334756',
			third_rgb: '51,71,86',
			fourth: '#029FCA',
			fourth_rgb: '2,159,202',
			pale: '#D9F3FF',
			pale_rgb: '217,243,255',
			contrast: '#FF4C29',
			constrast_rgb: '255,176,19',
			hover: '#00cbe6',
			background: '#292929',
			background_rgb: '34,34,34',
			background_hover: '#292929',
			bg_shade_one: '#3D3D3D',
			bg_shade_two: '#474747',
			bg_shade_three: '#525252',
			bg_shade_four: '#5C5C5C',
			foreground: '#f0f6fc',
			fg_shade_one: '#f5f5f5',
			fg_shade_two: '#ebebeb',
			fg_shade_three: '#d9d9d9',
			fg_shade_four: '#bfbfbf',
			foreground_rgb: '240,246,252',
			tableback: '#25496f',
			databack: '#b0b0b0',
			headerAIBack:
				'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,9,121,1) 0%, rgba(0,2,42,1) 0%, rgba(0,49,130,1) 100%)',
		},
		background: '#222222',
		name: 'dark',
	},
};

export const commonColors = {
	almost_black: '#23272A',
	dark_gray: '#616161',
};
/*

	POTENTIAL THEME

	light: {
		color: {
			primary: '#012a4a',
			primary_rgb: '1,42,74',
			secondary: '#013a63',
			secondary_rgb: '63,156,243',
			third: '#01497c',
			third_rgb: '0,186,198',
			fourth: '#029FCA',
			fourth_rgb: '2,159,202',
			pale: '#D9F3FF',
			pale_rgb: '217,243,255',
			contrast: '#ffb013',
			constrast_rgb: '255,176,19',
			hover: '#00cbe6',
			background: '#ffffff',
			background_rgb: '255,255,255',
			foreground: 'black',
			foreground_rgb: '0,0,0',
		},
		background: '#ffffff',
		name: 'light',
	},
*/

export const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
}>({ theme: themes.light, setTheme: () => {} });