package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASFonction;
import interpreteur.as.lang.ASScope;
import interpreteur.as.lang.managers.ASFonctionManager;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Argument;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.as.lang.ASType;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.Arrays;
import java.util.List;


public class CreerFonction extends Programme {
    private final ASScope scope;
    private final Var var;
    private final List<Argument> args;
    private final ASType typeRetour;

    public CreerFonction(Var var, Argument[] args, ASType typeRetour, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.args = Arrays.asList(args);
        this.typeRetour = typeRetour;
        // declare fonction
        ASScope.getCurrentScope().declarerVariable(new ASVariable(var.getNom(), null, new ASType("fonctionType")));
        this.scope = ASScope.makeNewCurrentScope();
    }

    @Override
    public NullType execute() {
        ASScope scope = new ASScope(this.scope);
        ASFonction fonction = new ASFonction(var.getNom(), this.args.stream().map(Argument::eval).toArray(ASFonctionModule.Parametre[]::new), this.typeRetour, executeurInstance);

        ASScope.getCurrentScopeInstance().getVariable(fonction.getNom()).changerValeur(fonction);
        // declare fonction
        // Scope.getCurrentScope().declarerVariable(new ASObjet.Variable(fonction.getNom(), fonction, new Type(fonction.obtenirNomType())));

        // declare params
        for (Argument arg : this.args) {
            ASFonctionModule.Parametre param = arg.eval();
            scope.declarerVariable(new ASVariable(param.getNom(), param.getValeurParDefaut(), param.getType()));
            //ASObjet.VariableManager.ajouterVariable(new ASObjet.Variable(param.getNom(), param.getValeurParDefaut(), param.getType()), scopeName);
        }

        fonction.setScope(scope);
        scope.setParent(ASScope.getCurrentScopeInstance());

        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("fonc_" + ASFonctionManager.ajouterDansStructure(this.var.getNom())));
    }

    @Override
    public String toString() {
        return "CreerFonction{" +
                "nom=" + var +
                ", args=" + args +
                ", typeRetour?=" + typeRetour +
                '}';
    }
}
