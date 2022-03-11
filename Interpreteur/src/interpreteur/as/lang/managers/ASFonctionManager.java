package interpreteur.as.lang.managers;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASScope;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.ASType;

public class ASFonctionManager {

    private static String structure = "";

    // met la fonction dans le dictionnaire de fonction et cree enregistre la fonction dans une Variable
    // pour que le code puisse la retrouver plus tard
    public static void ajouterFonction(ASFonctionModule fonction) {
        ASScope.getCurrentScope().declarerVariable(new ASVariable(fonction.getNom(), fonction, new ASType(fonction.obtenirNomType())));
        //VariableManager.ajouterConstante(new Constante(fonction.getNom(), fonction));
        //fonction.nom = ajouterDansStructure(fonction.getNom());
    }

    public static String obtenirStructure() {
        return structure;
    }

    public static String ajouterDansStructure(String element) {
        return (structure.isBlank() ? "" : structure + ".") + element;
    }

    public static void ajouterStructure(String nomStruct) {
        if (nomStruct == null) return;
        structure += (structure.isBlank() ? "" : ".") + nomStruct;
    }

    public static void retirerStructure() {
        structure = structure.contains(".") ? structure.substring(0, structure.lastIndexOf(".")) : "";

    }

    public static void reset() {
        structure = "";
    }
}
