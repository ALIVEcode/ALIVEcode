package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet.*;
import interpreteur.as.Objets.Scope;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public final record ASModule(Fonction[] fonctions,
                       Variable[] variables) {

    public ASModule(Fonction[] fonctions) {
        this(fonctions, new Variable[]{});
    }

    public ASModule(Variable[] variables) {
        this(new Fonction[]{}, variables);
    }

    public void utiliser(String prefix) {
        FonctionManager.ajouterStructure(prefix);
        for (Fonction fonction : fonctions) {
            Scope.getCurrentScope().declarerVariable(new Variable(fonction.getNom(), fonction, new Type(fonction.obtenirNomType())));
        }
        for (Variable variable : variables) {
            Scope.getCurrentScope().declarerVariable(variable.clone());
        }
        FonctionManager.retirerStructure();
    }

    public void utiliser(List<String> nomMethodes) {
        for (Fonction fonction : fonctions) {
            if (nomMethodes.contains(fonction.getNom()))
                FonctionManager.ajouterFonction(fonction);
        }
        for (Variable variable : variables) {
            if (nomMethodes.contains(variable.obtenirNom())) {
                Scope.getCurrentScope().declarerVariable(variable);
            }
        }
    }

    /**
     * @return un array contenant toutes les fonctions du module
     */
    public Fonction[] getFonctions() {
        return fonctions;
    }

    /**
     * @return un array contenant toutes les variables du module
     */
    public Variable[] getVariables() {
        return variables;
    }

    /**
     * @return la liste des noms des fonctions du module
     */
    public List<String> getNomsFonctions() {
        if (fonctions.length == 0) return new ArrayList<>();
        return Stream.of(fonctions).map(Fonction::getNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsVariables() {
        if (variables.length == 0) return new ArrayList<>();
        return Stream.of(variables).map(Variable::obtenirNom).collect(Collectors.toList());
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














