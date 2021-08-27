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

import javax.lang.model.type.NullType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


public class Lire extends Programme {
    private final Expression<?> message, fonction;
    private final String nomVar;

    public Lire(Var var, Expression<?> message, Expression<?> fonction) {
        this.nomVar = var.getNom();
        this.message = message == null ? new ValeurConstante(new ASObjet.Texte("Entrez un input")) : message;
        //Scope.getCurrentScope().declarerVariable(new ASObjet.Variable(nomVar, null, new Type("tout")));
        this.fonction = fonction;
    }

    @Override
    public NullType execute() {
        if (Data.response.isEmpty()) {
            throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("read").addParam(message.eval().getValue().toString()));
        } else {
            ASObjet.Texte data = new ASObjet.Texte(Data.response.pop());
            if (this.fonction == null) {
                Scope.getCurrentScopeInstance().getVariable(nomVar).changerValeur(new ASObjet.Texte(data));
                return null;
            }
            ASObjet<?> exprEval = this.fonction.eval();
            ASObjet<?> valeur;
            List<ASObjet.Texte> argument = Collections.singletonList(data);
            if (exprEval instanceof ASObjet.Fonction) {
                valeur = ((ASObjet.Fonction) exprEval).setParamPuisExecute(new ArrayList<>(argument));
            } else if (exprEval instanceof ASFonction) {
                valeur = ((ASFonction) exprEval).makeInstance().executer(new ArrayList<>(argument));
            } else {
                throw new ASErreur.ErreurInputOutput("Un \u00E9l\u00E9ment de type 'fonctionType' est attendue " +
                        "apr\u00E8s le deux points ':' dans la commande 'lire', mais '" +
                        exprEval.obtenirNomType() + "' a \u00E9t\u00E9 trouv\u00E9.");
            }
            Scope.getCurrentScopeInstance().getVariable(nomVar).changerValeur(valeur);
        }
        return null;
    }
}
