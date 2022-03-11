package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASFonction;
import interpreteur.as.lang.ASScope;
import interpreteur.as.lang.managers.ASFonctionManager;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.as.lang.ASType;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CreerSetter extends Programme {
    private final Var var;
    private final Var nomArg;
    private final ASType type;
    private final ASScope scope;

    public CreerSetter(Var var, Var nomArg, ASType type, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.nomArg = nomArg;
        this.type = type;
        this.addSetter();
        this.scope = ASScope.makeNewCurrentScope();
    }

    public Var getVar() {
        return var;
    }

    public void addSetter() {
        ASVariable v =  ASScope.getCurrentScope().getVariable(var.getNom());

        if (v == null) {
            Declarer.addWaitingSetter(this);
            return;
        }

        v.setSetter((valeur) -> {
            ASScope scope = new ASScope(this.scope);
            scope.setParent(ASScope.getCurrentScopeInstance());

            ASFonction set = new ASFonction(this.var.getNom(), new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(this.type, this.nomArg.getNom(), null)
            }, this.type, executeurInstance);

            scope.declarerVariable(new ASVariable(this.nomArg.getNom(), null, this.type));

            set.setScope(scope);
            set.setCoordBlocName("set_");

            return set.makeInstance().executer(new ArrayList<>(Collections.singletonList(valeur)));
        });
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("set_" +
                                                             (ASFonctionManager.obtenirStructure().isBlank() ? "" : ASFonctionManager.obtenirStructure() + ".") + ligne.get(1).obtenirValeur()));
    }
}
