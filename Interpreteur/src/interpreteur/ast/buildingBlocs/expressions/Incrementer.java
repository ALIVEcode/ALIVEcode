package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.programmes.Assigner;

public record Incrementer(Expression<?> expr,
                          byte signe) implements Expression<ASObjet<?>> {
    public Incrementer {
        if (expr instanceof Incrementer) {
            throw new ASErreur.ErreurAssignement("Il est impossible de mettre plusieurs incr\u00E9mentations en chaine");
        }
    }

    @Override
    public ASObjet<?> eval() {
        if (expr instanceof Var || expr instanceof CreerListe.SousSection.IndexSection) {
            new Assigner(expr, new ValeurConstante(new ASEntier(signe)), BinOp.Operation.PLUS).execute();
            return expr.eval();
        }
        return new BinOp(expr, BinOp.Operation.PLUS, new ValeurConstante(new ASEntier(signe))).eval();
    }

    @Override
    public String toString() {
        return "Incrementer{" +
                "expr=" + expr +
                ", signe=" + signe +
                '}';
    }
}
