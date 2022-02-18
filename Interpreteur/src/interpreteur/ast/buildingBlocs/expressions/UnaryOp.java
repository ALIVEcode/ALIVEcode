package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.datatype.ASNombre;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.Function;

public record UnaryOp(Expression<?> expression,
                      Operation op) implements Expression<ASObjet<?>> {

    @Override
    public String toString() {
        return "UnaryOp{" +
                "expression=" + expression +
                ", op=" + op +
                '}';
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet<?> result = null;
        try {
            result = this.op.apply(this.expression);
        } catch (ClassCastException err) {
            // TODO lancer erreur d'arithmétique
        }
        return result;
    }


    public enum Operation {
        /**
         * Gere |x|
         */
        ABSOLUE(expr -> expr instanceof ASDecimal decimal ?
                new ASDecimal(Math.abs(decimal.getValue())) :
                new ASEntier(Math.abs(((ASEntier) expr).getValue()))
        ),

        PLUS(expr -> {
            if (expr instanceof ASNombre) {
                return expr;
            } else {
                String nb = expr.getValue().toString();
                return ASNombre.parse(expr);
                // obsolete try {
                //     boolean estDecimal = nb.contains(".");
                //     if (estDecimal) return new ASObjet.Decimal(Double.parseDouble(nb));
                //     else return new ASObjet.Entier(Integer.parseInt(nb));
                // } catch (NumberFormatException ignored) {
                //     throw new ASErreur.ErreurType("Il est impossible de convertir '" + nb + "' en nombre decimal");
                // }
            }
        }),

        NEGATION(expr -> {
            if (expr instanceof ASDecimal decimal) {
                return new ASDecimal(-decimal.getValue());
            } else if (expr instanceof ASEntier entier) {
                return new ASEntier(-entier.getValue());
            } else {
                String nb = expr.getValue().toString();
                try {
                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new ASDecimal(-Double.parseDouble(nb));
                    else return new ASEntier(-Integer.parseInt(nb));
                } catch (NumberFormatException ignored) {
                    throw new ASErreur.ErreurType("impossible de convertir '" + nb + "' en nombre decimal");
                }
            }
        }),

        ;

        private final Function<ASObjet<?>, ASObjet<?>> eval;

        Operation(Function<ASObjet<?>, ASObjet<?>> eval) {
            this.eval = eval;
        }

        public ASObjet<?> apply(Expression<?> expression) {
            ASObjet<?> expr = expression.eval();
            return this.eval.apply(expr);
        }

    }


}
