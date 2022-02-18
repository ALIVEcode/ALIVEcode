package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public record Ternary(Expression<?> test,
                      Expression<?> gauche,
                      Expression<?> droite) implements Expression<ASObjet<?>> {

    @Override
    public ASObjet<?> eval() {
        if (test.eval().boolValue()) {
            return gauche.eval();
        } else {
            return droite.eval();
        }
    }

    @Override
    public String toString() {
        return "Ternary{" +
                "test=" + test +
                ", gauche=" + gauche +
                ", droite=" + droite +
                '}';
    }
}
