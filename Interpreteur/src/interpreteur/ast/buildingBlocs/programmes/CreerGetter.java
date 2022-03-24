package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASFonction;
import interpreteur.as.lang.ASScope;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.as.lang.ASType;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.ArrayList;
import java.util.List;

public class CreerGetter extends Programme {
    private final Var var;
    private final ASType type;
    private final ASScope scope;

    public CreerGetter(Var var, ASType type, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.type = type;
        this.addGetter();
        this.scope = ASScope.makeNewCurrentScope();
    }

    public Var getVar() {
        return var;
    }

    public void addGetter() {
        ASVariable v = ASScope.getCurrentScope().getVariable(var.getNom());

        if (v == null) {
            Declarer.addWaitingGetter(this);
            return;
        }

        v.setGetter(() -> {
            ASScope scope = new ASScope(this.scope);
            scope.setParent(ASScope.getCurrentScopeInstance());

            ASFonction get = new ASFonction(this.var.getNom(), this.type, executeurInstance);
            get.setScope(scope);
            get.setCoordBlocName("get_");
            return get.makeInstance().executer(new ArrayList<>());
        });
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("get_" + ligne.get(1).obtenirValeur()));
    }

    @Override
    public String toString() {
        return "CreerGetter{" +
                "var=" + var +
                "type?=" + type +
                '}';
    }
}
