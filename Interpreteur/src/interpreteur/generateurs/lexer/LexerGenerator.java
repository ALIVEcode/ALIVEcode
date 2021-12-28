package interpreteur.generateurs.lexer;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import interpreteur.tokens.Token;


/**
 * @author Mathis Laroche
 */

/*
 *
 * Les explications vont être rajoutées quand j'aurai la motivation de les écrire XD
 *
 */


public class LexerGenerator {
    static private final ArrayList<Regle> reglesIgnorees = new ArrayList<>();
    static private ArrayList<Regle> reglesAjoutees = new ArrayList<>();

    public LexerGenerator() {
        reglesAjoutees.clear();
        reglesIgnorees.clear();
        Regle.reset();
    }
    /*
    protected void chargerRegles(File configGrammaire){
        try {
            Scanner grammaire = new Scanner(configGrammaire);

            String section = "";
            String categorie = "";
            boolean commentaire = false;

            while (grammaire.hasNextLine()) {
            	String line = grammaire.nextLine().trim();

            	if (line.startsWith("\"\"\"")) {
            		commentaire = ! commentaire;
            	}

            	if (commentaire || line.isBlank() || line.startsWith("#")) {
            		continue;
            	} else {
            		if (line.startsWith("[") && line.endsWith("]")) {
            			section = line.substring(1, line.length() - 1);
            			continue;
            		}
            		if (line.endsWith("{")) {
            			categorie = line.substring(0, line.length() - 1).trim();
            			continue;
            		}
            		if (line.equals("}")) {
            			categorie = "";
            			continue;
                    }
                }

                switch (section) {
                case "Ajouter":
                	String[] elements = line.split("->", 2);

                	ajouterRegle(elements[0].trim(), elements[1].trim(), categorie);
                	//System.out.println(elements[0].trim() + " " + elements[1].trim().substring(1, elements[1].trim().length()-1));
                	break;

                case "Ignorer":
                	ignorerRegle(line);
                	//System.out.println(line);
                	break;

                default:
                	break;
                }
            }

        grammaire.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
    */

    protected void ajouterRegle(String nom, String pattern, String categorie) {
        reglesAjoutees.add(new Regle(nom, pattern, categorie));
    }

    protected void sortRegle() {
        ArrayList<Regle> nomVars = reglesAjoutees.stream().filter(r -> r.getNom().equals("NOM_VARIABLE")).collect(Collectors.toCollection(ArrayList::new));
        reglesAjoutees = reglesAjoutees.stream().filter(r -> !r.getNom().equals("NOM_VARIABLE")).collect(Collectors.toCollection(ArrayList::new));

        Comparator<Regle> longueurRegle = (o1, o2) -> o2.getPattern().length() - o1.getPattern().length();

        reglesAjoutees.sort(longueurRegle);
        nomVars.sort(longueurRegle);

        reglesAjoutees.addAll(nomVars);
        // this.reglesAjoutees.forEach(r -> System.out.println(r.getNom() + "  " + r.getPattern()));
    }

    protected void ignorerRegle(String pattern) {
        reglesIgnorees.add(new Regle(pattern));
    }

    public ArrayList<Regle> getReglesAjoutees() {
        return reglesAjoutees;
    }

    public ArrayList<Regle> getReglesIgnorees() {
        return reglesIgnorees;
    }


    public List<Token> lex(String s) {

        List<Token> tokenList = new ArrayList<>();

        int idx = 0;
        int debut;

        while (idx < s.length()) {

            idx = this.prochainIndexValide(idx, s);

            boolean trouve = false;
            for (Regle regle : this.getReglesAjoutees()) {
                Matcher match = Pattern.compile(regle.getPattern()).matcher(s);
                if (match.find(idx) && match.start() == idx) {
                    debut = match.start();
                    idx = match.end();
                    tokenList.add(regle.makeToken(s.substring(match.start(), match.end()), debut));
                    trouve = true;
                    break;
                }
            }
            if (!trouve) {
                idx = ajouterErreur(idx, s, tokenList);
            }
        }
        return tokenList;
    }


    /**
     * @return le prochain index valide (ignore les patterns dans ignorerRegles)
     */
    private int prochainIndexValide(int idx, String s) {
        while (true) {
            boolean trouve = false;
            for (Regle regle : this.getReglesIgnorees()) {
                Matcher match = Pattern.compile(regle.getPattern()).matcher(s);
                if (match.find(idx) && match.start() == idx) {
                    trouve = true;
                    idx = match.end();
                }
            }
            if (!trouve) {
                break;
            }
        }
        return idx;
    }


    private int ajouterErreur(int idx, String s, List<Token> tokenList) {
        /**
         * @add le token ERREUR � la liste de token
         * @return le prochain index valide
         */
        idx = this.prochainIndexValide(idx, s);
        Matcher match = Pattern.compile("\\S+").matcher(s);
        //System.out.println("idxOrKey : " + idxOrKey);

        if (idx < s.length()) {
            match.find(idx);
            tokenList.add(new Token("(ERREUR)",
                    s.substring(match.start(), match.end()),
                    "",
                    match.start()));
            idx = match.end();
        }

        return idx;

    }
}




















