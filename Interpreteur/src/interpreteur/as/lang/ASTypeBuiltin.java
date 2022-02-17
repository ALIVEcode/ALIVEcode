package interpreteur.as.lang;

import interpreteur.ast.buildingBlocs.expressions.Type;

public enum ASTypeBuiltin {
    tout,
    entier,
    decimal,
    nombre(ASTypeBuiltin.entier, ASTypeBuiltin.decimal),
    texte,
    liste,
    dict,
    iterable(ASTypeBuiltin.texte, ASTypeBuiltin.liste, ASTypeBuiltin.dict),
    booleen,
    nulType,
    rien,
    paire,
    fonctionType;

    private final ASTypeBuiltin[] aliases;

    ASTypeBuiltin() {
        this.aliases = null;
    }

    ASTypeBuiltin(ASTypeBuiltin... alias) {
        this.aliases = alias;
    }

    public ASTypeBuiltin[] getAliases() {
        return aliases;
    }

    public Type asType() {
        return new Type(toString());
    }

    /* previous toString
    @Override
    public String toString() {
        return aliases == null ? super.toString() : ArraysUtils.join("|", aliases);
    }
    */
}
