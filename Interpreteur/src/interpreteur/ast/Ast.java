package interpreteur.ast;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * @author Mathis Laroche
 */
public abstract class Ast<T> implements BiFunction<List<Object>, Integer, T> {
    private final Hashtable<String, Ast<?>> sous_asts = new Hashtable<>();
    private int importance;

    public Ast() {
        this.importance = -1;
    }

    public Ast(int importance) {
        this.importance = importance;
    }

    @SafeVarargs
    public Ast(Map.Entry<String, Ast<?>>... sous_asts) {
        this();
        for (var sous_ast : sous_asts) {
            this.sous_asts.put(sous_ast.getKey(), sous_ast.getValue());
        }
    }

    @SafeVarargs
    public Ast(int importance, Map.Entry<String, Ast<?>>... sous_asts) {
        this(importance);
        for (var sous_ast : sous_asts) {
            this.sous_asts.put(sous_ast.getKey(), sous_ast.getValue());
        }
    }

    public Hashtable<String, Ast<?>> getSousAst() {
        return this.sous_asts;
    }

    public int getImportance() {
        return this.importance;
    }

    public void setImportance(int importance) {
        this.importance = importance;
    }

    @Override
    public abstract T apply(List<Object> p, Integer idxVariante);
}
