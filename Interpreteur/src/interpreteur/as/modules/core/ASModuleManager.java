package interpreteur.as.modules.core;


import interpreteur.as.lang.ASConstante;
import interpreteur.as.lang.datatype.ASListe;
import interpreteur.as.lang.ASScope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASTexte;
import interpreteur.as.modules.EnumModule;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.modules.core.ASModuleFactory;
import interpreteur.executeur.Executeur;

import java.util.*;

/**
 * Interface responsable de tous les modules builtins
 *
 * @author Mathis Laroche
 */
public record ASModuleManager(Executeur executeurInstance) {
    private final static Hashtable<EnumModule, ASModuleFactory> MODULE_FACTORY = new Hashtable<>();
    /*
    TABLE DES MATIERES:
    Module:
    -builtins

    -Voiture
    -Math
     */

    public static void enregistrerModule(EnumModule nomModule, ASModuleFactory moduleFactory) {
        MODULE_FACTORY.put(nomModule, moduleFactory);
    }

    public ASModule getModuleBuiltins() {
        return MODULE_FACTORY.get(EnumModule.builtins).charger(executeurInstance);
    }

    public void utiliserModuleBuitlins() {
        var moduleBuiltins = getModuleBuiltins();
        moduleBuiltins.utiliser((String) null);
        ASScope.getCurrentScope().declarerVariable(new ASConstante("builtins", new ASListe(moduleBuiltins
                .getNomsConstantesEtFonctions()
                .stream()
                .map(ASTexte::new)
                .toArray(ASTexte[]::new))));

    }

    public void utiliserModule(String nomModule) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisqu'il est utilise par defaut");
            return;
        }

        // module vide servant à charger les fonctionnalitées expérimentales
        if (nomModule.equals("experimental")) {
            return;
        }
        ASModule module = getModule(nomModule);

        module.utiliser(nomModule);
        ASScope.getCurrentScope().declarerVariable(new ASConstante(nomModule, new ASListe(module
                .getNomsConstantesEtFonctions()
                .stream()
                .map(e -> nomModule + "." + e)
                .map(ASTexte::new)
                .toArray(ASTexte[]::new))));
    }

    /**
     * @param nomModule <li>nom du module a utiliser</li>
     * @param methodes  <li></li>
     */
    public void utiliserModule(String nomModule, String[] methodes) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisque le module builtins est utilise par defaut");
            return;
        }

        ASModule module = getModule(nomModule);

        List<String> nomsFctEtConstDemandees = Arrays.asList(methodes);

        List<String> fctEtConstPasDansModule = new ArrayList<>(nomsFctEtConstDemandees);
        fctEtConstPasDansModule.removeAll(module.getNomsConstantesEtFonctions());

        if (fctEtConstPasDansModule.size() > 0)
            throw new ASErreur.ErreurModule("Le module '" + nomModule + "' ne contient pas les fonctions ou les constantes: "
                    + fctEtConstPasDansModule.toString()
                    .replaceAll("\\[|]", ""));

        module.utiliser(nomsFctEtConstDemandees);
        ASScope.getCurrentScope().declarerVariable(new ASConstante(nomModule, new ASListe(nomsFctEtConstDemandees
                .stream()
                .map(ASTexte::new)
                .toArray(ASTexte[]::new))));
    }


    public ASModule getModule(String nomModule) {
        ASModuleFactory module;
        try {
            module = MODULE_FACTORY.get(EnumModule.valueOf(nomModule));
        } catch (IllegalArgumentException err) {
            throw new ASErreur.ErreurModule("Le module '" + nomModule + "' n'existe pas");
        }
        return module.charger(executeurInstance);
    }
}



























