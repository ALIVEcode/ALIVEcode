import AccountPageDemo from './AccountPageDemo';

const DevWeb = () => {
	return (
		<div className="w-full h-full bg-[color:var(--background-color)] p-20">
			<div className="text-4xl mb-8">Web Moderne</div>
			<div className="text-2xl mb-2">Démo informations de compte</div>
			<AccountPageDemo></AccountPageDemo>
			<p className="mt-4">
				<strong>Défi:</strong> Essayez d'ajouter une page permettant de voir les
				niveaux de l'utilisateur.{' '}
			</p>
			<span className="text-sm italic">
				Inspirez-vous du composant de compte (AccountPageDemo) et essayez de
				trouver la bonne méthode à appeler dans l'api
			</span>
		</div>
	);
};

export default DevWeb;
