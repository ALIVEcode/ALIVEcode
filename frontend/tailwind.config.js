module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	important: true,
	theme: {
		extend: {},
		screens: {
			xs: '480px',
			// => @media (min-width: 480px) { ... }

			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1380px',
			// => @media (min-width: 1280px) { ... }

			phone: '480px',
			// => @media (min-width: 480px) { ... }

			tablet: '640px',
			// => @media (min-width: 640px) { ... }

			laptop: '1024px',
			// => @media (min-width: 1024px) { ... }

			desktop: '1280px',
			// => @media (min-width: 1280px) { ... }

			big: '1380px',
			// => @media (min-width: 1280px) { ... }
		},
	},
	plugins: [],
};
