package interpreteur.as.lang.datatype;

import javax.lang.model.type.NullType;

public class ASNul implements ASObjet<NullType> {

    public ASNul() {
    }

    @Override
    public String toString() {
        return "nul";
    }

    @Override
    public NullType getValue() {
        return null;
    }

    @Override
    public boolean boolValue() {
        return false;
    }

    @Override
    public String obtenirNomType() {
        return "nulType";
    }

    @Override
    public boolean equals(Object obj) {
        return obj instanceof ASObjet<?> arrObj && arrObj.getValue() == null;
    }
}
