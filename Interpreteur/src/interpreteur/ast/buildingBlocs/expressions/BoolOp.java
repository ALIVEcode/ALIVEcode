package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.datatype.ASBooleen;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;

public record BoolOp(Expression<?> gauche,
                     Operateur op,
                     Expression<?> droite) implements Expression<ASObjet<?>> {

    @Override
    public String toString() {
        return "BoolOp{" +
                "gauche=" + gauche +
                ", droite?=" + droite +
                ", op=" + op +
                '}';
    }

    @Override
    public ASObjet<?> eval() {
        return this.op.apply(this.gauche, this.droite);
    }

    public enum Operateur {
        ET((gauche, droite) -> {
            if (!gauche.boolValue())
                return gauche;
            else
                return droite;
        }),

        OU((gauche, droite) -> {
            if (gauche.boolValue())
                return gauche;
            else
                return droite;
        }),

        PAS((gauche, droite) -> {
            return new ASBooleen(!gauche.boolValue());
        });

        private final BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval;

        Operateur(BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval) {
            this.eval = eval;
        }

        public ASObjet<?> apply(Expression<?> gauche, Expression<?> droite) {
            /*
             * TODO erreur si gauche.eval() et/ou droite.eval()~ n'est pas de type ASObjet.Booleen
             */
            ASObjet<?> g = gauche.eval();
            ASObjet<?> d = droite == null ? null : droite.eval();
            return this.eval.apply(g, d);
        }
    }
}
