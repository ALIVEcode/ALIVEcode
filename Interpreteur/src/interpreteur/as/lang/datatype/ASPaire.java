package interpreteur.as.lang.datatype;

import java.util.Map;

public record ASPaire(ASTexte clef, ASObjet<?> valeur) implements ASObjet<Map.Entry<ASTexte, ASObjet<?>>> {

    @Override
    public Map.Entry<ASTexte, ASObjet<?>> getValue() {
        return Map.entry(clef, valeur);
    }

    @Override
    public boolean boolValue() {
        return valeur.boolValue();
    }

    @Override
    public String obtenirNomType() {
        return "paire";
    }

    @Override
    public String toString() {
        return clef + ": " + (valeur instanceof ASTexte ? "'" + valeur + "'" : valeur);
    }
}
