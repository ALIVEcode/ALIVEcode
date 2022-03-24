package interpreteur.as.lang.datatype;


import interpreteur.as.erreurs.ASErreur.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

//import interpreteur.ast.buildingBlocs.expressions.Type;


/**
 * Interface que tous les objets d'alivescript doivent r\u00E9aliser
 *
 * @author Mathis Laroche
 */
public interface ASObjet<T> {

    T getValue();

    boolean boolValue();

    String obtenirNomType();
}



















