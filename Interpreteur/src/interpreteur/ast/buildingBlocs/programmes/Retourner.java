package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;

public class Retourner extends Programme {
    private final Expression<?> expr;

    public Retourner(Expression<?> expr) {
        this.expr = expr;
    }

    @Override
    public ASObjet<?> execute() {
        return expr.eval();
    }

    @Override
    public String toString() {
        return "Retourner{" +
                "expr=" + expr +
                '}';
    }
}
