package interpreteur.executeur;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class PreCompiler {
    public final static String COMMENTAIRE = "#";
    public final static String MULTI_LIGNE_DEBUT = "(:";
    public final static String MULTI_LIGNE_FIN = ":)";

    public final static String DOCUMENTATION_DEBUT = "(-:";
    public final static String DOCUMENTATION_FIN = ":-)";

    public final static List<String> joinNextLine = Arrays.asList(
            ",",
            "(",
            "{",
            "["
    );

    public final static List<String> joinPrevLine = Arrays.asList(
            "}",
            "]",
            ")"
    );


    public static String[] preCompile(String[] lignes) {
        StringBuilder lignesFinales = new StringBuilder();

        boolean multiligne = false;
        boolean documentation = false;
        lignes = Stream.of(lignes).map(
                ligne -> ligne.endsWith("\n") ?
                        ligne.substring(0, ligne.length() - 1).trim()
                        :
                        ligne.trim()
        ).toArray(String[]::new);

        for (String s : lignes) {
            String ligne = s;

            if (multiligne) {
                if (ligne.contains(MULTI_LIGNE_FIN)) {
                    multiligne = false;
                    ligne = ligne.substring(ligne.indexOf(MULTI_LIGNE_FIN) + MULTI_LIGNE_FIN.length()).trim();
                } else continue;
            }
            if (documentation) {
                if (ligne.contains(DOCUMENTATION_FIN)) {
                    documentation = false;
                    ligne = ligne.substring(ligne.indexOf(DOCUMENTATION_FIN) + DOCUMENTATION_FIN.length()).trim();
                } else continue;
            }
            if (ligne.contains(COMMENTAIRE)) {
                ligne = ligne.substring(0, ligne.indexOf(COMMENTAIRE)).trim();
            }
            if (ligne.contains(MULTI_LIGNE_DEBUT)) {
                ligne = ligne.substring(0, ligne.indexOf(MULTI_LIGNE_DEBUT)).trim();
                multiligne = true;
            }
            if (ligne.contains(DOCUMENTATION_DEBUT)) {
                ligne = ligne.substring(0, ligne.indexOf(DOCUMENTATION_DEBUT)).trim();
                documentation = true;
            }
            // the lastChar in the line
            String lastChar = ligne.length() > 0 ? ligne.charAt(ligne.length() - 1) + "" : "";

            // if the line ends with a ',' or '(' or '[' or '{', combine it with the next line
            ligne = joinNextLine.contains(lastChar) ? ligne : ligne + "\n";

            // if the line ends with '\', remove it and combine the line with the next line
            ligne = lastChar.equals("\\") ? ligne.substring(0, ligne.lastIndexOf(lastChar)) : ligne;

            if (Arrays.stream(ligne.trim().split("")).allMatch(joinPrevLine::contains)) {
                lignesFinales.delete(lignesFinales.length() - 1, lignesFinales.length());
            }

            // adds the line to the final lines
            lignesFinales.append(ligne);
        }

        // split newlines of the final String to transform it into a String[]
        return Stream.of(lignesFinales.toString().split("\n"))
                .map(ligne -> ligne.trim() + "\n")
                .toArray(String[]::new);
    }

}

















