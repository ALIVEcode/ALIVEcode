package interpreteur.as.lang;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.managers.ASFonctionManager;

import java.util.function.Function;
import java.util.function.Supplier;

public class ASVariable implements ASObjet<Object> {
    private final String nom;
    private final ASType type;
    private ASObjet<?> valeur;
    private boolean readOnly = false;

    private Supplier<ASObjet<?>> getter = null;
    private Function<ASObjet<?>, ASObjet<?>> setter = null;


    public ASVariable(String nom, ASObjet<?> valeur, ASType type) {
        this.type = type == null ? new ASType("tout") : type;
        this.nom = ASFonctionManager.ajouterDansStructure(nom);
        this.valeur = valeur instanceof interpreteur.as.lang.ASVariable var ? var.getValeurApresGetter() : valeur;
    }

    private boolean nouvelleValeurValide(ASObjet<?> nouvelleValeur) {
        if (getType().noMatch(nouvelleValeur.obtenirNomType())) {
            throw new ASErreur.ErreurAssignement("La variable '" +
                                                 nom +
                                                 "' est de type *" +
                                                 obtenirNomType() +
                                                 "*. Elle ne peut pas prendre une valeur de type *" +
                                                 nouvelleValeur.obtenirNomType() +
                                                 "*.");
        }
        return true;
    }

    /**
     * applique le setter
     *
     * @param valeur
     */
    public void changerValeur(ASObjet<?> valeur) {
        if (nouvelleValeurValide(valeur)) {
            if (this.setter != null) {
                this.valeur = this.setter.apply(valeur);
            } else {
                this.valeur = valeur;
            }
        }
    }

    @Override
    public interpreteur.as.lang.ASVariable clone() {
        return new interpreteur.as.lang.ASVariable(nom, this.valeur, this.type).setGetter(this.getter).setSetter(this.setter);
    }

    public String obtenirNom() {
        return this.nom;
    }

    public ASType getType() {
        return type;
    }

    public boolean pasInitialisee() {
        return this.valeur == null;
    }

    public interpreteur.as.lang.ASVariable setGetter(Supplier<ASObjet<?>> getter) {
        this.getter = getter;
        return this;
    }

    public interpreteur.as.lang.ASVariable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
        this.setter = setter;
        return this;
    }

    public interpreteur.as.lang.ASVariable setReadOnly() {
        this.setter = (valeur) -> {
            throw new ASErreur.ErreurAssignement("Cette variable est en lecture seule: elle ne peut pas \u00EAtre modifi\u00E9e");
        };
        this.readOnly = true;
        return this;
    }

    public boolean isReadOnly() {
        return readOnly;
    }

    @Override
    public String toString() {
        return "Variable{" +
               "nom='" + nom + '\'' +
               ", type='" + type + '\'' +
               ", valeur=" + valeur +
               ", getter=" + getter +
               ", setter=" + setter +
               '}';
    }

    /* différentes manières de get la valeur stockée dans la variable */
    public ASObjet<?> getValeur() {
        return this.valeur;
    }

    /**
     * by pass the setter
     *
     * @param valeur
     */
    public void setValeur(ASObjet<?> valeur) {
        if (nouvelleValeurValide(valeur))
            this.valeur = valeur;
    }

    public ASObjet<?> getValeurApresGetter() {
        if (this.valeur == null) {
            throw new ASErreur.ErreurAssignement("La variable '" + nom + "' est utilis\u00E9e avant d'\u00EAtre d\u00E9clar\u00E9e");
        }
        if (this.getter != null) {
            return this.getter.get();
        }
        return this.valeur;
    }

    @Override
    public Object getValue() {
        if (this.valeur == null) {
            throw new ASErreur.ErreurAssignement("La variable '" + nom + "' est utilis\u00E9e avant d'\u00EAtre d\u00E9clar\u00E9e");
        }
        if (this.getter != null) {
            return this.getter.get().getValue();
        }
        return this.valeur.getValue();
    }

    @Override
    public boolean boolValue() {
        return this.valeur.boolValue();
    }

    @Override
    public String obtenirNomType() {
        return this.type.getNom();
    }
}
