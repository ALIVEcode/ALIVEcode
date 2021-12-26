import {Syntax} from 'refractor/lib/core'
import { LinterFormatType } from '../LevelComponents/LineInterface/mode-alivescript';
import cacheLintInfo from '../LevelComponents/LineInterface/cache_lintinfo.json';
import axios from 'axios';

async function define() {
	const lintInfo: LinterFormatType = await (
		await axios({
			method: 'GET',
			url: '/lintinfo/',
			baseURL: process.env.REACT_APP_AS_URL,
		})
	).data;
	return lintInfo;
}

let lintInfo: LinterFormatType = cacheLintInfo as LinterFormatType;
define().then(resolve => (lintInfo = resolve));

const alivescript: Syntax = (Prism: any) => {
	Prism.languages.alivescript = {
		comment: {
			pattern: new RegExp('#.*'),
		},
		keyword: new RegExp(
			`${lintInfo.logiques.join('|')}
            |${lintInfo.blocs.join('|')}
            |${lintInfo.blocs
							.map(token => `${lintInfo.fin} ${token}`)
							.join('|')}
            |${lintInfo.control_flow.join('|')}`,
		),

		builtin: new RegExp(lintInfo.fonctions_builtin.join('|')),

		operator: new RegExp(lintInfo.operators.join('|')),

		//punctuation: {},
		function: {
			pattern: new RegExp(
				`${lintInfo.fonctions.join('|')}
                |${lintInfo.fonctions
									.map(token => `${lintInfo.fin} ${token}`)
									.join('|')}`,
				'g',
			),
		},

		number: new RegExp(
			`(${lintInfo.datatype.decimal}|${lintInfo.datatype.entier})`,
		),

		string: {
			pattern: new RegExp(lintInfo.datatype.texte),
			greedy: true,
		},

		boolean: new RegExp(
			`(${lintInfo.datatype.booleen}|${lintInfo.datatype.nul})`,
		),
		variable: new RegExp(''),
	};

	Prism.languages.as = Prism.languages.alivescript;
};

alivescript.displayName = 'alivescript';
alivescript.aliases = ['as'];

export default alivescript;