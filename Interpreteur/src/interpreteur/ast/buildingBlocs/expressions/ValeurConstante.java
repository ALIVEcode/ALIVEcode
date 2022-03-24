package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.datatype.ASTexte;
import interpreteur.ast.buildingBlocs.Expression;

public record ValeurConstante(ASObjet<?> val) implements Expression<ASObjet<?>> {

    @Override
    public ASObjet<?> eval() {
        return val;
    }

    @Override
    public String toString() {
        return "ValeurConstante{" +
               "val=" + (val instanceof ASTexte ? "'" + val.toString().replaceAll("'", "\\\\'") + "'" : val) +
               '}';
    }
}


























