export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#1E3A8A', // Синий цвет как основной
				secondary: '#9333EA', // Фиолетовый для акцентов
				textMain: '#333',
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
	],
};