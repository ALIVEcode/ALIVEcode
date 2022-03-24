package interpreteur.as.lang.datatype;

import interpreteur.as.erreurs.ASErreur;

public interface ASNombre extends ASObjet<Number> {
    static boolean estNumerique(String txt) {
        try {
            var estDecimal = txt.contains(".");
            if (estDecimal) Double.parseDouble(txt);
            else Integer.parseInt(txt);
            return true;
        } catch (NumberFormatException err) {
            return false;
        }
    }

    static ASNombre parse(ASObjet<?> nb) {
        String txt = nb.toString();
        if (!ASNombre.estNumerique(txt))
            throw new ASErreur.ErreurType("Impossible de convertir " + txt + " en nombre entier ou d\u00E9cimal.");

        return txt.contains(".") ? new ASDecimal(Double.parseDouble(txt)) : new ASEntier(Integer.parseInt(txt));
    }

    static ASNombre cast(Number nb) {
        return nb.doubleValue() != nb.intValue() ? new ASDecimal(nb) : new ASEntier(nb);
    }

    static Number asNumber(ASObjet<?> nb) {
        String txt = nb.toString();
        if (!ASNombre.estNumerique(txt))
            throw new ASErreur.ErreurType("Impossible de convertir " + txt + " en nombre entier ou d\u00E9cimal.");

        return (Number) nb.getValue();
    }

    static Double asDouble(ASObjet<?> nb) {
        String txt = nb.toString();
        if (!ASNombre.estNumerique(txt))
            throw new ASErreur.ErreurType("Impossible de convertir " + txt + " en nombre entier ou d\u00E9cimal.");

        return ((Number) nb.getValue()).doubleValue();
    }

    static Integer asInteger(ASObjet<?> nb) {
        String txt = nb.toString();
        if (!ASNombre.estNumerique(txt))
            throw new ASErreur.ErreurType("Impossible de convertir " + txt + " en nombre entier ou d\u00E9cimal.");

        return ((Number) nb.getValue()).intValue();
    }

    @Override
    default String obtenirNomType() {
        return "nombre";
    }
}
