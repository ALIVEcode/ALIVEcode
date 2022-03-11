package interpreteur.as.modules.core;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.ASScope;
import interpreteur.as.lang.managers.ASFonctionManager;
import interpreteur.as.lang.ASType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public record ASModule(ASFonctionModule[] fonctions,
                             ASVariable[] variables) {

    public ASModule(ASFonctionModule[] fonctions) {
        this(fonctions, new ASVariable[]{});
    }

    public ASModule(ASVariable[] variables) {
        this(new ASFonctionModule[]{}, variables);
    }

    public void utiliser(String prefix) {
        ASFonctionManager.ajouterStructure(prefix);
        for (ASFonctionModule fonction : fonctions) {
            ASScope.getCurrentScope().declarerVariable(new ASVariable(fonction.getNom(), fonction, new ASType(fonction.obtenirNomType())));
        }
        for (ASVariable variable : variables) {
            ASScope.getCurrentScope().declarerVariable(variable.clone());
        }
        ASFonctionManager.retirerStructure();
    }

    public void utiliser(List<String> nomMethodes) {
        for (ASFonctionModule fonction : fonctions) {
            if (nomMethodes.contains(fonction.getNom()))
                ASFonctionManager.ajouterFonction(fonction);
        }
        for (ASVariable variable : variables) {
            if (nomMethodes.contains(variable.obtenirNom())) {
                ASScope.getCurrentScope().declarerVariable(variable);
            }
        }
    }

    /**
     * @return un array contenant toutes les fonctions du module
     */
    public ASFonctionModule[] getFonctions() {
        return fonctions;
    }

    /**
     * @return un array contenant toutes les variables du module
     */
    public ASVariable[] getVariables() {
        return variables;
    }

    /**
     * @return la liste des noms des fonctions du module
     */
    public List<String> getNomsFonctions() {
        if (fonctions.length == 0) return new ArrayList<>();
        return Stream.of(fonctions).map(ASFonctionModule::getNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsVariables() {
        if (variables.length == 0) return new ArrayList<>();
        return Stream.of(variables).map(ASVariable::obtenirNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsConstantesEtFonctions() {
        List<String> noms = getNomsFonctions();
        noms.addAll(getNomsVariables());
        return noms;
    }

    @Override
    public String toString() {
        return "Module{\n" +
                "fonctions=" + Arrays.toString(fonctions) + "\n" +
                ", variables=" + Arrays.toString(variables) + "\n" +
                '}';
    }
}














