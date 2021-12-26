package interpreteur.as.modules;

import interpreteur.executeur.Executeur;

@FunctionalInterface
public interface ModuleFactory {

    ASModule charger(Executeur executeurInstance);

}
