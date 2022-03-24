package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.ASConstante;
import interpreteur.as.lang.ASType;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.ASScope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.*;

import java.util.HashSet;

public class Declarer extends Programme {
    private static final HashSet<CreerSetter> waitingSetters = new HashSet<>();
    private static final HashSet<CreerGetter> waitingGetters = new HashSet<>();

    private final Expression<?> valeur;
    private final boolean constante;
    private final ASType type;
    private final Var var;

    public Declarer(Expression<?> expr, Expression<?> valeur, ASType type, boolean constante) {
        // get la variable
        if (expr instanceof Var) {
            var = (Var) expr;
        } else {
            throw new ASErreur.ErreurSyntaxe("Il est impossible d'assigner \u00E0 autre chose qu'une variable");
        }

        this.valeur = valeur;
        this.constante = constante;
        this.type = type == null ? new ASType("tout") : type;
        addVariable();
    }

    public static void addWaitingGetter(CreerGetter getter) {
        waitingGetters.add(getter);
    }

    public static void addWaitingSetter(CreerSetter setter) {
        waitingSetters.add(setter);
    }

    public static void reset() {
        waitingGetters.clear();
        waitingSetters.clear();
    }

    private void addVariable() {

        // get l'objet variable s'il existe
        // ASObjet.Variable varObj = ASObjet.VariableManager.obtenirVariable(var.getNom(), var.getScope());
        ASVariable varObj = ASScope.getCurrentScope().getVariable(var.getNom());

        // si la variable existe déjà et que c'est une constante, lance une erreur, car on ne peut pas modifier une constante
        if (varObj != null)
            throw new ASErreur.ErreurAssignement("La variable '" + var.getNom() + "' a d\u00E9j\u00E0 \u00E9t\u00E9 d\u00E9clar\u00E9e");

        // si le mot "const" est présent dans l'assignement de la variable, on crée la constante
        // sinon si la variable a été déclarée avec "var", on crée la variable
        varObj = constante ? new ASConstante(var.getNom(), null) : new ASVariable(var.getNom(), null, type);

        ASScope.getCurrentScope().declarerVariable(varObj);

        var.setNom(varObj.obtenirNom());

        // si des setters et des getters attendaient la déclaration de la variable pour pouvoir être attachée à celle-ci, on les attache
        CreerGetter getter = waitingGetters.stream().filter(waitingGetter -> waitingGetter.getVar().equals(var)).findFirst().orElse(null);
        CreerSetter setter = waitingSetters.stream().filter(waitingSetter -> waitingSetter.getVar().equals(var)).findFirst().orElse(null);
        if (getter != null) {
            getter.addGetter();
            waitingGetters.remove(getter);
        }
        if (setter != null) {
            setter.addSetter();
            waitingSetters.remove(setter);
        }
    }

    @Override
    public Object execute() {
        //ASObjet.Variable variable = ASObjet.VariableManager.obtenirVariable(var.getNom());
        ASVariable variable = ASScope.getCurrentScopeInstance().getVariable(var.getNom());
        if (this.valeur != null) {
            ASObjet<?> valeur = this.valeur.eval();
            variable.setValeur(valeur);
        }
        return null;
    }

    @Override
    public String toString() {
        return "Declarer{" +
                "valeur=" + valeur +
                ", constante=" + constante +
                ", type=" + type +
                ", var=" + var +
                '}';
    }
}
