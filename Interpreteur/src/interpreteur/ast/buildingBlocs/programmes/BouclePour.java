package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASConstante;
import interpreteur.as.lang.ASScope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASIterable;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.as.lang.ASType;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.Iterator;
import java.util.List;

public class BouclePour extends Boucle {
    public static boolean sortir = false;
    private final Var var;
    private final Expression<?> objItere;
    private final ASScope scope;
    private Iterator<ASObjet<?>> iteration = null;
    private ASType typeVar = new ASType("tout");

    public BouclePour(Var var, Expression<?> objItere, Executeur executeurInstance) {
        super("pour", executeurInstance);
        this.var = var;
        this.objItere = objItere;
        this.scope = ASScope.makeNewCurrentScope();
    }

    public BouclePour setDeclarerVar(boolean estConst, ASType typeVar) {
        this.typeVar = typeVar == null ? this.typeVar : typeVar;
        if (estConst) {
            scope.declarerVariable(new ASConstante(var.getNom(), null));
        } else {
            scope.declarerVariable(new ASVariable(var.getNom(), null, typeVar));
        }
        return this;
    }

    public void sortir() {
        ASScope.popCurrentScopeInstance();
        iteration = null;
        sortir = false;
    }

    @Override
    public NullType execute() {
        if (iteration == null) {
            if (!(objItere.eval() instanceof ASIterable)) {
                throw new ASErreur.ErreurType("Seuls les valeurs de type 'iterable' ('texte' et 'liste') sont accept\u00E0es dans les boucles pour");
            }
            iteration = ((ASIterable) objItere.eval()).iter();
            ASScope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
        }

        if (iteration.hasNext() && !sortir) {
            ASScope.popCurrentScopeInstance();
            ASScope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
            ASVariable variable = ASScope.getCurrentScopeInstance().getVariable(var.getNom());
            if (variable == null) {
                throw new ASErreur.ErreurVariableInconnue("La variable " + var.getNom() + " n'a pas \u00E9t\u00E9 initialis\u00E9e." +
                        "\nAvez-vous oubli\u00E9 de mettre 'var' devant la d\u00E9claration de la variable?");
            } else {
                variable.changerValeur(iteration.next());
            }
            executeurInstance.obtenirCoordRunTime().nouveauBloc("pour");

        } else sortir();

        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return executeurInstance.obtenirCoordRunTime().nouveauBloc("pour");
    }

    @Override
    public String toString() {
        return "BouclePour{" +
                "var=" + var +
                ", objItere=" + objItere +
                '}';
    }
}
