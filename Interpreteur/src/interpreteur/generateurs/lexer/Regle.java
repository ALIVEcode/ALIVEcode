package interpreteur.generateurs.lexer;

import interpreteur.tokens.Token;

import java.util.ArrayList;
import java.util.Hashtable;


/**
 * @author Mathis Laroche
 */


public class Regle {
    
    static private final Hashtable<String, ArrayList<String>> categories = new Hashtable<>();

    private final String nom, pattern, categorie;

    public static void reset() {
        categories.clear();
    }

    public Regle(String nom, String pattern, String categorie){
        this.nom = nom;
        this.pattern = pattern;
        this.categorie = categorie;

        categories.putIfAbsent(categorie, new ArrayList<>());
        categories.get(categorie).add(nom);
    }

    public Regle(String pattern){
        this.categorie = null;
        this.pattern = pattern;
        this.nom = null;
    }

    public String getNom(){
        return this.nom;
    }

    public String getPattern(){
        return this.pattern;
    }

    public String getCategorie(){
        return this.categorie;
    }

    public Token makeToken(String valeur, int debut) {
        return new Token(this.nom, valeur, this.categorie, debut, this);
    }

    public static Hashtable<String, ArrayList<String>> getCategories(){
        return categories;
    }

    public static ArrayList<String> getMembreCategorie(String nomCategorie){
        return categories.get(nomCategorie);
    }

    @Override
    public String toString() {
        return "Regle{" +
                "nom='" + nom + '\'' +
                ", pattern='" + pattern + '\'' +
                ", categorie='" + categorie + '\'' +
                '}';
    }
}
