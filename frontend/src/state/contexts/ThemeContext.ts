import { createContext } from 'react';
import { hexToRGB } from '../../Types/utils';

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
		background: string;
		background_rgb: string;
		background_hover: string;
		background_hover_rgb: string;
		fg_shade_one: string;
		fg_shade_one_rgb: string;
		fg_shade_two: string;
		fg_shade_two_rgb: string;
		fg_shade_three: string;
		fg_shade_three_rgb: string;
		fg_shade_four: string;
		fg_shade_four_rgb: string;
		bg_shade_one: string;
		bg_shade_one_rgb: string;
		bg_shade_two: string;
		bg_shade_two_rgb: string;
		bg_shade_three: string;
		bg_shade_three_rgb: string;
		bg_shade_four: string;
		bg_shade_four_rgb: string;
		foreground: string;
		foreground_rgb: string;
		tableback: string;
		databack: string;
		header_ai_back: string;
	};
	background: string;
	name: string;
};

const addHexColors = (colors: { [key: string]: string }) => {
	return Object.entries(colors).reduce(
		(cols: { [key: string]: string }, entry: [string, string]) => {
			cols[`${entry[0]}_rgb`] = hexToRGB(entry[1]);
			return cols;
		},
		colors,
	);
};

// Throws errors because of typing but works
export const themes: { light: Theme; dark: Theme } = {
	light: {
		color: {
			...addHexColors({
				primary: '#2E75FF',
				secondary: '#92B7FF',
				third: '#04e6d3',
				fourth: '#029FCA',
				pale: '#D9F3FF',
				contrast: '#ffb013',
				background: '#ffffff',
				background_hover: '#bfbfbf',
				bg_shade_one: '#f5f5f5',
				bg_shade_two: '#ebebeb',
				bg_shade_three: '#d9d9d9',
				bg_shade_four: '#bfbfbf',
				foreground: '#283143',
				fg_shade_one: '#3D3D3D',
				fg_shade_two: '#474747',
				fg_shade_three: '#525252',
				fg_shade_four: '#5C5C5C',
			}),
			...{
				tableback: '#9ecbff',
				databack: '#f2f2f2',
				header_ai_back: 'linear-gradient(90deg, #2E75FF 0%, #04dbe6 100%)',
			},
		},
		background: '#ffffff',
		name: 'light',
	},
	dark: {
		color: {
			...addHexColors({
				primary: '#02111D',
				secondary: '#2C394B',
				third: '#334756',
				fourth: '#029FCA',
				pale: '#D9F3FF',
				contrast: '#FF4C29',
				background: '#242424',
				background_hover: '#222222',
				bg_shade_one: '#3D3D3D',
				bg_shade_two: '#474747',
				bg_shade_three: '#525252',
				bg_shade_four: '#5C5C5C',
				foreground: '#f0f6fc',
				fg_shade_one: '#f5f5f5',
				fg_shade_two: '#ebebeb',
				fg_shade_three: '#d9d9d9',
				fg_shade_four: '#bfbfbf',
			}),
			...{
				tableback: '#25496f',
				databack: '#b0b0b0',
				header_ai_back:
					'linear-gradient(90deg, #02111D 0%, rgba(0,49,130,1) 100%)',
			},
		},
		background: '#222222',
		name: 'dark',
	},
};

export const commonColors = {
	almost_black: '#23272A',
	dark_gray: '#616161',
	logo: '#2E75FF',
	danger: '#dc2626',
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
