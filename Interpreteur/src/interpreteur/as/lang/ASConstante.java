package interpreteur.as.lang;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASObjet;

import java.util.function.Function;
import java.util.function.Supplier;

public class ASConstante extends ASVariable {

    public ASConstante(String nom, ASObjet<?> valeur) {
        super(nom, valeur, new ASType("tout"));
    }

    @Override
    public ASVariable clone() {
        return new interpreteur.as.lang.ASConstante(obtenirNom(), this.getValeur());
    }

    @Override
    public ASVariable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
        throw new ASErreur.ErreurAssignement("Les constantes ne peuvent pas avoir de setter");
    }

    @Override
    public ASVariable setGetter(Supplier<ASObjet<?>> getter) {
        throw new ASErreur.ErreurAssignement("Les constantes ne peuvent pas avoir de getter");
    }

    @Override
    public void changerValeur(ASObjet<?> valeur) {
        if (this.getValeur() != null)
            throw new ASErreur.ErreurAssignement("Il est impossible de changer la valeur d'une constante");
        super.changerValeur(valeur);
    }
}
