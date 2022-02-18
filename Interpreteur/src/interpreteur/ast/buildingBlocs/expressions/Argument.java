package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASType;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class Argument implements Expression<ASFonctionModule.Parametre> {
    private final Var var;
    private final ASObjet<?> valeurParDefaut;
    private final ASType type;

    public Argument(Var var, Expression<?> valeurParDefaut, ASType type) {
        this.var = var;
        this.type = type;
        try {
            this.valeurParDefaut = valeurParDefaut == null ? null : valeurParDefaut.eval();
        } catch (ASErreur.ErreurVariableInconnue e) {
            throw new ASErreur.ErreurVariableInconnue("Impossible d'utiliser une variable comme valeur par défaut d'une fonction");
        }
        if (this.type != null && this.valeurParDefaut != null && this.type.noMatch(this.valeurParDefaut.obtenirNomType())) {
            throw new ASErreur.ErreurType("Le parametre '" + var.getNom() + "' est de type '" + type.nom() +
                    "', mais la valeur par d\u00E9faut est de type '" + this.valeurParDefaut.obtenirNomType() + "'.");
        }
    }


    @Override
    public ASFonctionModule.Parametre eval() {
        return new ASFonctionModule.Parametre(type, var.getNom(), valeurParDefaut);
    }

    @Override
    public String toString() {
        return "Argument{" +
                "nom=" + var +
                ", valeurParDefaut?=" + valeurParDefaut +
                ", type?=" + type +
                '}';
    }
}
