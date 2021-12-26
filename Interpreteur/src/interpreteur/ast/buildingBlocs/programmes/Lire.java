package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASFonction;
import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.ast.buildingBlocs.expressions.ValeurConstante;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;
import org.jetbrains.annotations.NotNull;

import javax.lang.model.type.NullType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class Lire extends Programme {
    private final Expression<?> message, fonction;
    private final Var var;

    public Lire(Var var, Expression<?> message, Expression<?> fonction, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.message = message == null ? new ValeurConstante(new ASObjet.Texte("Entrez un input")) : message;
        //Scope.getCurrentScope().declarerVariable(new ASObjet.Variable(nomVar, null, new Type("tout")));
        this.fonction = fonction;
    }

    @Override
    public NullType execute() {
        assert executeurInstance != null;
        if (executeurInstance.getDataResponse().isEmpty())
            throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("read").addParam(message.eval().getValue().toString()));

        ASObjet.Texte data = new ASObjet.Texte(executeurInstance.getDataResponse().pop());
        if (this.fonction == null) {
            new Assigner(var, new ValeurConstante(new ASObjet.Texte(data)), null).execute();
            return null;
        }
        ASObjet<?> exprEval = this.fonction.eval();
        ASObjet<?> valeur;
        List<ASObjet.Texte> argument = Collections.singletonList(data);
        if (exprEval instanceof ASObjet.Fonction fct) {
            valeur = fct.setParamPuisExecute(new ArrayList<>(argument));
        } else if (exprEval instanceof ASFonction fct) {
            valeur = fct.makeInstance().executer(new ArrayList<>(argument));
        } else {
            throw new ASErreur.ErreurInputOutput("Un \u00E9l\u00E9ment de type 'fonctionType' est attendue " +
                    "apr\u00E8s le deux points ':' dans la commande 'lire', mais '" +
                    exprEval.obtenirNomType() + "' a \u00E9t\u00E9 trouv\u00E9.");
        }
        new Assigner(var, new ValeurConstante(valeur), null).execute();

        return null;

    }
}

