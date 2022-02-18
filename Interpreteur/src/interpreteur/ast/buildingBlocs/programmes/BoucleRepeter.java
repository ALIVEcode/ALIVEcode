package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASScope;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class BoucleRepeter extends Boucle {
    public static boolean sortir = false;

    private final Expression<?> nbFois;
    private Integer end = null;
    private int current = 0;
    private final ASScope scope;

    public BoucleRepeter(Expression<?> nbFois, Executeur executeurInstance) {
        super("repeter", executeurInstance);
        this.nbFois = nbFois;
        this.scope = ASScope.makeNewCurrentScope();
    }

    public void sortir() {
        current = 0;
        end = null;
        sortir = false;
        ASScope.popCurrentScopeInstance();
    }

    @Override
    public NullType execute() {
        // first time
        if (end == null) {
            ASScope.pushCurrentScopeInstance(this.scope.makeScopeInstanceFromCurrentScope());
            end = (Integer) nbFois.eval().getValue();
        }

        // other times
        if (current++ < end && !sortir) {
            ASScope.popCurrentScopeInstance();
            ASScope.pushCurrentScopeInstance(this.scope.makeScopeInstanceFromCurrentScope());
            executeurInstance.obtenirCoordRunTime().nouveauBloc("repeter");
        }
        else sortir();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return coord.nouveauBloc("repeter");
    }

    @Override
    public String toString() {
        return "BoucleRepeter{" +
                "nbFois=" + nbFois +
                '}';
    }
}
