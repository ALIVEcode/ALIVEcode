package interpreteur.as.lang.datatype;

import interpreteur.as.erreurs.ASErreur;

import java.util.Iterator;
import java.util.List;

public interface ASIterable<T> extends ASObjet<T> {
    boolean contient(ASObjet<?> element);

    interpreteur.as.lang.datatype.ASIterable<T> sousSection(int debut, int fin);

    ASObjet<?> get(int index);

    int taille();

    Iterator<ASObjet<?>> iter();

    default int idxRelatif(List<?> valeur, int idx) {
        if (Math.abs(idx) > valeur.size()) {
            throw new ASErreur.ErreurIndex("l'index est trop grand");
        }
        idx = (idx < 0) ? valeur.size() + idx : idx;
        return idx;
    }

    @Override
    default String obtenirNomType() {
        return "iterable";
    }
}
