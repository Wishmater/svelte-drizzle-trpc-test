import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const withMT = require("@material-tailwind/html/utils/withMT");

export default withMT({
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {

		}
	},

	plugins: [
		typography,
		forms,
		containerQueries,
	]
}) satisfies Config;
