package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASScope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.List;

public class FinBoucle extends Programme {
    private final String nomBoucle;

    public FinBoucle(String nomBoucle, Executeur executeurInstance) {
        super(executeurInstance);
        ASScope.popCurrentScope();
        this.nomBoucle = nomBoucle;
    }

    @Override
    public ASObjet<?> execute() {
        executeurInstance.obtenirCoordRunTime().recommencerLeBlocActuel();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        String blocActuel = coord.getBlocActuel().replaceAll("_", " ");
        if (!blocActuel.equals(nomBoucle)) {

            blocActuel = switch (blocActuel) {
                case "faire" -> "tant que";
                case "sinon" -> "si";
                default -> blocActuel;
            };

            throw new ASErreur.ErreurFermeture(blocActuel,
                    "fin " + nomBoucle, "fin " + blocActuel);

        }
        return coord.finBloc();
    }

    @Override
    public String toString() {
        return "FinBoucle";
    }
}