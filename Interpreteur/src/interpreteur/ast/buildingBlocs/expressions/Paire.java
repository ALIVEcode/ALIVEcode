package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.ASPaire;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;

public record Paire(Expression<?> clef, Expression<?> valeur) implements Expression<ASPaire> {

    @Override
    public ASPaire eval() {
        if (!(clef.eval() instanceof ASObjet.Texte texte)) {
            throw new ASErreur.ErreurType("La clef d'une paire d'\u00E9l\u00E9ments doit \u00EAtre " +
                    "un \u00E9l\u00E9ment de type texte");
        }
        return new ASPaire(texte, valeur.eval());
    }

    @Override
    public String toString() {
        return "Pair{" +
                "clef=" + clef +
                ", valeur=" + valeur +
                '}';
    }
}
