package interpreteur.generateurs.ast;

import java.util.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.Ast;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.generateurs.lexer.Regle;
import interpreteur.tokens.Token;
import interpreteur.utils.ArraysUtils;
import interpreteur.utils.Range;

/**
 * @author Mathis Laroche
 */

/**
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 */


public class AstGenerator {
    static Hashtable<String, Ast<?>> programmesDict = new Hashtable<>();
    static ArrayList<String> ordreProgrammes = new ArrayList<>();

    static Hashtable<String, Ast<?>> expressionsDict = new Hashtable<>();
    static ArrayList<String> ordreExpressions = new ArrayList<>();
    private int cptrExpr = 0;
    private int cptrProg = 0;

    private static ArrayList<String> ajouterSousAstOrdre(Hashtable<String, Ast<?>> sous_ast) {
        ArrayList<String> nouvelOrdre = new ArrayList<>(ordreExpressions);

        if (sous_ast.size() > 0) {
            for (String pattern : sous_ast.keySet()) {
                if (ordreExpressions.contains(pattern)) {
                    nouvelOrdre.remove(pattern);
                }
                int importance = sous_ast.get(pattern).getImportance();
                if (importance == -1) {
                    nouvelOrdre.add(pattern);
                } else {
                    if (nouvelOrdre.size() > importance && nouvelOrdre.get(importance) == null) {
                        nouvelOrdre.set(importance, pattern);
                    } else {
                        if (nouvelOrdre.size() < importance) nouvelOrdre.add(pattern);
                        else nouvelOrdre.add(importance, pattern);
                    }
                }
            }
            ordreExpressions.removeIf(Objects::isNull);
            //System.out.println(this.ordreExpressions);
        }
        return nouvelOrdre;
    }

    public static void hasSafeSyntax(Token[] expressionArray) {
        int parentheses = 0;
        int braces = 0;
        int crochets = 0;

        for (Token token : expressionArray) {
            switch (token.obtenirNom()) {
                case "PARENT_OUV" -> parentheses++;
                case "PARENT_FERM" -> parentheses--;

                case "CROCHET_OUV" -> crochets++;
                case "CROCHET_FERM" -> crochets--;

                case "BRACES_OUV" -> braces++;
                case "BRACES_FERM" -> braces--;
            }
        }

        String pluriel = Math.abs(parentheses) > 1 ? "s" : "";

        //System.out.println(Arrays.toString(expressionArray));

        switch (Integer.compare(parentheses, 0)) {
            case -1 -> throw new ASErreur.ErreurSyntaxe(-parentheses + " parenth\u00E8se" + pluriel + " ouvrante" + pluriel + " '(' manquante" + pluriel);
            case 1 -> throw new ASErreur.ErreurSyntaxe(parentheses + " parenth\u00E8se" + pluriel + " fermante" + pluriel + " ')' manquante" + pluriel);
        }

        pluriel = Math.abs(braces) > 1 ? "s" : "";
        switch (Integer.compare(braces, 0)) {
            case -1 -> throw new ASErreur.ErreurSyntaxe(-braces + " accolade" + pluriel + " ouvrante" + pluriel + " '{' manquante" + pluriel);
            case 1 -> throw new ASErreur.ErreurSyntaxe(braces + " accolade" + pluriel + " fermante" + pluriel + " '}' manquante" + pluriel);
        }

        pluriel = Math.abs(crochets) > 1 ? "s" : "";
        switch (Integer.compare(crochets, 0)) {
            case -1 -> throw new ASErreur.ErreurSyntaxe(-crochets + " crochet" + pluriel + " ouvrant" + pluriel + " '[' manquant" + pluriel);
            case 1 -> throw new ASErreur.ErreurSyntaxe(crochets + " crochet" + pluriel + " fermant" + pluriel + " ']' manquant" + pluriel);
        }

    }

    public static Expression<?> evalOneExpr(ArrayList<Object> expressions, Hashtable<String, Ast<?>> sous_ast) {
        var result = eval(expressions, sous_ast);
        if (result.size() != 1) {
            throw new ASErreur.ErreurSyntaxe("Erreur ligne 106 dans AstGenerator");
        } else {
            return result.get(0);
        }
    }

    public static ArrayList<Expression<?>> eval(ArrayList<Object> expressions, Hashtable<String, Ast<?>> sous_ast) {

        var regleSyntaxeDispo = new Hashtable<>(expressionsDict);
        var ordreRegleSyntaxe = new ArrayList<>(ordreExpressions);

        if (sous_ast != null) {
            regleSyntaxeDispo.putAll(sous_ast);
            ordreRegleSyntaxe = ajouterSousAstOrdre(sous_ast);
        }

        //System.out.println(expressions);
        if (expressions.size() == 0) {
            return new ArrayList<>();
        }
        if (expressions.get(0) instanceof ArrayList<?>) {
            ArrayList<Object> expressionList = new ArrayList<>();
            for (Object expr : expressions) {
                expressionList.addAll(eval((ArrayList<Object>) expr, regleSyntaxeDispo));
            }
            return expressionList.stream().map(e -> (Expression<?>) e).collect(Collectors.toCollection(ArrayList::new));
        }

        ArrayList<Object> expressionArray = new ArrayList<>(expressions);

        hasSafeSyntax(expressionArray.stream().filter(e -> e instanceof Token).toArray(Token[]::new));

        for (String regleSyntaxeEtVariante : ordreRegleSyntaxe) {
            for (String regleSyntaxe : regleSyntaxeEtVariante.split("~")) {
                regleSyntaxe = regleSyntaxe.trim();

                List<String> membresRegleSyntaxe = Arrays.asList(regleSyntaxe.split(" "));
                int nbNotExpr = (int) membresRegleSyntaxe.stream().filter(e -> e.equals("!expression")).count();
                int longueurRegleSyntaxe = membresRegleSyntaxe.size() - nbNotExpr;

                int i = 0, debut, exprLength;
                while (i + longueurRegleSyntaxe <= expressionArray.size()) {

                    List<String> expressionNom = new ArrayList<>();

                    for (Object expr : expressionArray) {
                        expressionNom.add(expr instanceof Token token ? token.obtenirNom() : "expression");
                    }
                    //System.out.println("Nom " + expressionNom);
                    Matcher match = memeStructureExpression(String.join(" ", expressionNom.subList(i, expressionNom.size())), regleSyntaxe);
                    if (regleSyntaxe.contains("#expression") && match.find()) {
                        if (match.start() != 0 || (expressionArray.get(i) instanceof Token && regleSyntaxe.startsWith("expression"))) {
                            i++;
                            continue;
                        }
                        // obtiens l'index du premier élément qui match avec la règle de syntaxe
                        debut = i;
                        expressionNom = expressionNom.subList(i, expressionNom.size());


                        /*
                         * Check to make sure an expression is not a token
                         */


                        // comment if (nbNotExpr > 0 && i > 0 && expressionNom.get(i - 1).equals("expression")) {
                        //     i++;
                        //     continue;
                        // }

                        /*
                         * End of the check
                         */

                        String ouv = membresRegleSyntaxe.get(membresRegleSyntaxe.indexOf("#expression") - 1);
                        String ferm = membresRegleSyntaxe.get(membresRegleSyntaxe.size() - 1);

                        Range range = ArraysUtils.enclose(expressionNom, ouv, ferm);
                        assert range != null;
                        //int premier_ouv = expressionNom.indexOf(ouv);
                        //System.out.println(expressionNom);
                        // algorithme des parenthèses (), des crochets [] et des accolades {}
                        //int cptr = 0;
                        //exprLength = premier_ouv;
                        //do {
                        //    String exp = expressionNom.get(exprLength);
                        //    if (exp.equals(ferm)) {
                        //        cptr--;
                        //    } else if (exp.equals(ouv)) {
                        //        cptr++;
                        //    }
                        //    //comment System.out.println("\nexp: " + exp
                        //    //        + "\nfin: " + exprLength
                        //    //        + "\ncptr: " + cptr
                        //    //        + "\n" + "-".repeat(10)
                        //    //);
                        //    exprLength++;
                        //} while (cptr > 0);

                        //comment for (String exp : expressionNom.subList(premier_ouv + 1, expressionNom.size())) {
                        //    if (exp.equals(ouv)) {
                        //        cptr++;
                        //    } else if (exp.equals(ferm)) {
                        //        cptr--;
                        //    }
                        //    idxOrKey++;
                        //    if (cptr == 0) {
                        //        break;
                        //    }
                        //}


                        List<Object> expr = expressionArray.subList(debut, debut + range.end());

                        // System.out.println("\nregle: " + regleSyntaxe + "\nexpr: " + expr);
                        //expr.stream().map(Object::toString).forEach(Executeur::printCompiledCode);


                        Expression<?> capsule = (Expression<?>) expressionsDict.get(regleSyntaxeEtVariante).apply(new ArrayList<>(expr));
                        //System.out.println(capsule);

                        ArrayList<Object> newArray = new ArrayList<>(expressionArray.subList(0, debut));
                        newArray.add(capsule);
                        newArray.addAll(expressionArray.subList(debut + range.end(), expressionArray.size()));

                        //System.out.println(expressionArray);
                        expressionArray = newArray;
                        //System.out.println(expressionArray);

                    } else {
                        if (regleSyntaxe.contains("!expression") && i > 0 && expressionNom.get(i - 1).equals("expression")) {
                            i++;
                            continue;
                        }
                        debut = i;
                        exprLength = debut + longueurRegleSyntaxe;

                        if (memeStructureExpression(String.join(" ", expressionNom.subList(debut, exprLength)), regleSyntaxe).matches()) {
                            //System.out.println(expressionNom);

                            /*
                            ---------------------------- Start Experimental ------------------------------
                             */

                            //System.out.println(memeStructure(String.join(" ", expressionNom.subList(debut, fin)), expression).toString());
                            //System.out.println(expressionArray);
                            if ((regleSyntaxe.startsWith("expression") &&
                                    (!(expressionArray.get(debut) instanceof Expression<?>))
                                    ||
                                    expressionArray.get(debut) == null)
                            ) {
                                i++;
                                continue;
                            }
                            /*
                            ---------------------------- End Experimental ------------------------------
                             */
                            //System.out.println("expr ->" + expression + " : " + expressionArray.subList(debut, fin));

                            Expression<?> capsule = (Expression<?>) regleSyntaxeDispo.get(regleSyntaxeEtVariante).apply(expressionArray.subList(debut, exprLength));
                            //System.out.println(capsule);

                            ArrayList<Object> newArray = new ArrayList<>(debut != 0 ? expressionArray.subList(0, debut) : new ArrayList<>());
                            newArray.add(capsule);
                            newArray.addAll(expressionArray.subList(debut + longueurRegleSyntaxe, expressionArray.size()));

                            expressionArray = newArray;
                            //System.out.println(expressionArray);
                            if (longueurRegleSyntaxe == 1) i++;

                        } else {
                            i++;
                        }
                    }
                }
            }
        }

        Token[] token = expressionArray.stream().filter(e -> e instanceof Token).toArray(Token[]::new);

        if (token.length > 0) {
            throw new ASErreur.ErreurSyntaxe("Expression ill\u00E9gale: " + String.join(" ", Arrays.stream(token).map(Token::obtenirValeur).toArray(String[]::new)));
        }

        //System.out.println(expressionArray);
        return ((ArrayList<?>) expressionArray).stream().map(e -> (Expression<?>) e).collect(Collectors.toCollection(ArrayList::new));
    }

    public static Matcher memeStructureProgramme(String line, String structurePotentielle) {
        //System.out.println(structurePotentielle.replaceAll("( ?)(#?)expression ?", Matcher.quoteReplacement("\\b.+")));
        Pattern structurePattern = Pattern.compile(structurePotentielle.replaceAll("( ?)(#?)expression ?", Matcher.quoteReplacement("\\b.+")));
        return structurePattern.matcher(line);
    }

    // TODO TEST!!!!!!
    public static Matcher memeStructureExpression(String line, String structurePotentielle) {
        Pattern structurePattern = Pattern.compile(structurePotentielle
                .replaceAll("#expression", Matcher.quoteReplacement("\\b.+"))
                .replaceAll("!expression *", Matcher.quoteReplacement("(?<!expression )"))
        );
        //System.out.println(line + " matcher:" + structurePattern.matcher(line));
        return structurePattern.matcher(line);
    }

    static protected void reset() {
        expressionsDict.clear();
        programmesDict.clear();
        ordreExpressions.clear();
        ordreProgrammes.clear();
    }

    public static ArrayList<String> getOrdreExpressions() {
        return ordreExpressions;
    }

    public static ArrayList<String> getOrdreProgrammes() {
        return ordreProgrammes;
    }

    private String remplacerCategoriesParMembre(String pattern) {
        String nouveauPattern = pattern;
        for (String option : pattern.split("~")) {
            for (String motClef : option.split(" ")) {  // on divise le pattern en mot clef afin d'evaluer ceux qui sont des categories (une categorie est entouree par des {})
                if (motClef.startsWith("{") && motClef.endsWith("}")) {  // on test si le mot clef est une categorie
                    ArrayList<String> membresCategorie = Regle.getMembreCategorie(motClef.substring(1, motClef.length() - 1)); // on va chercher les membres de la categorie (toutes les regles)
                    if (membresCategorie == null) {
                        throw new Error("La categorie: '" + pattern + "' n'existe pas");    // si la categorie n'existe pas, on lance une erreur
                    } else {
                        nouveauPattern = nouveauPattern.replace(motClef, "(" + String.join("|", membresCategorie) + ")");
                        // on remplace la categorie par les membres de la categorie
                        // pour ce faire, on entoure les membres dans des parentheses et on
                        // separe les membres par des |
                        // de cette facon, lorsque nous allons tester par regex si une ligne correspond
                        // a un programme ou une expression, la categorie va "matcher" avec
                        // tous les membres de celle-ci
                    }
                }
            }
        }
        return nouveauPattern;  // on retourne le pattern avec les categories changees
    }

    protected void ajouterProgramme(String pattern, Ast<?> fonction) {
		/*
            importance : 0 = plus important
            si plusieurs programmes ont la mÃªme importance, le dernier ajoutÃ© sera priorisÃ©
		 */

        for (String programme : pattern.split("~")) {
            var sousAstCopy = new Hashtable<>(fonction.getSousAst());
            for (String p : sousAstCopy.keySet()) {
                fonction.getSousAst().remove(p);
                fonction.getSousAst().put(remplacerCategoriesParMembre(p), sousAstCopy.get(p));
            }
            fonction.setImportance(cptrProg++);
            String nouveauPattern = remplacerCategoriesParMembre(programme);
            programmesDict.put(nouveauPattern, fonction); // remplace les categories par ses membres, s'il n'y a pas de categorie, ne modifie pas le pattern
            ordreProgrammes.add(nouveauPattern);
        }
    }

    protected void ajouterExpression(String pattern, Ast<?> fonction) {
		/*
            importance : 0 = plus important
            si plusieurs expressions ont la mÃªme importance, la derniÃ¨re ajoutÃ©e sera priorisÃ©e
		 */
        String nouveauPattern = remplacerCategoriesParMembre(pattern);
        fonction.setImportance(cptrExpr++);
        expressionsDict.put(nouveauPattern, fonction);
        ordreExpressions.add(nouveauPattern);
    }

    protected void setOrdreProgramme() {
        for (int i = 0; i < programmesDict.size(); ++i) {
            ordreProgrammes.add(null);
        }
        for (String pattern : programmesDict.keySet()) {
            int importance = programmesDict.get(pattern).getImportance();
            if (importance == -1) {
                ordreProgrammes.add(pattern);
            } else {
                //if (ordreProgrammes.get(importance) == null) {
                //    ordreProgrammes.set(importance, pattern);
                //} else {
                //    ordreProgrammes.add(importance, pattern);
                //}
                ordreProgrammes.add(importance, pattern);
            }
        }
        ordreProgrammes.removeIf(Objects::isNull);
        //System.out.println(this.ordreProgrammes);
    }

    protected void setOrdreExpression() {
        for (int i = 0; i < expressionsDict.size(); ++i) {
            ordreExpressions.add(null);
        }
        for (String pattern : expressionsDict.keySet()) {
            int importance = expressionsDict.get(pattern).getImportance();
            if (importance == -1) {
                ordreExpressions.add(pattern);
            } else {
                if (ordreExpressions.get(importance) == null) {
                    ordreExpressions.set(importance, pattern);
                } else {
                    ordreExpressions.add(importance, pattern);
                }
            }
        }
        ordreExpressions.removeIf(Objects::isNull);
        //System.out.println(this.ordreExpressions);
    }

    public Programme parse(List<Token> listToken) {
        //System.out.println("\n");

        String programme = obtenirProgramme(listToken);
        if (programme == null) {
            throw new ASErreur.ErreurSyntaxe("Syntaxe invalide: " + listToken.stream().map(Token::obtenirValeur).collect(Collectors.toList()));
        }
        //System.out.println("Programme trouvé: " + programme);

        var expressions_programme = obtenirDivisionExpressionsProgramme(listToken, programme);

        var expressions = new ArrayList<>(expressions_programme.subList(0, expressions_programme.size() - 1));
        var programmeToken = expressions_programme.get(expressions_programme.size() - 1);


        var arbre = eval(
                expressions.stream().map(e -> (Object) e).collect(Collectors.toCollection(ArrayList::new)),
                programmesDict.get(programme).getSousAst()
        );

        ArrayList<Object> finalLine = new ArrayList<>(Arrays.asList(programme.split(" ")));


        Iterator<?> expressionIt = arbre.iterator();
        Iterator<Token> programmeIt = programmeToken.iterator();

        finalLine.replaceAll(e -> e.equals("expression") ? expressionIt.hasNext() ? expressionIt.next() : null : programmeIt.hasNext() ? programmeIt.next() : null);

        //System.out.println(finalLine);
        if (expressionIt.hasNext()) {
            throw new ASErreur.ErreurSyntaxe("Syntaxe invalide. Est-ce qu'il manque une virgule entre deux \u00E9l\u00E9ments?");
        }

        return (Programme) programmesDict.get(programme).apply(finalLine);
    }

    public String obtenirProgramme(List<Token> listToken) {
        String programmeTrouve = null;
        List<String> structureLine = new ArrayList<>();
        listToken.forEach(e -> structureLine.add(e.obtenirNom()));
        //System.out.println(structureLine);
        int nbTokenProgrammeTrouvee = 0;
        for (String programme : ordreProgrammes) {
            //System.out.println(programme + " " + structureLine);
            for (String programmeAlter : programme.split("~")) {
                if (memeStructureProgramme(String.join(" ", structureLine), programmeAlter).matches()) {
                    int nbTokenProgrammeAlter = programmeAlter.replaceAll("#?expression", "").replaceAll("(\\(.+\\))|(\\w+)", "T").length();
                    if (programmeTrouve == null || nbTokenProgrammeTrouvee < nbTokenProgrammeAlter) {
                        programmeTrouve = programme;
                        nbTokenProgrammeTrouvee = programmeTrouve.replaceAll("#?expression", "").replaceAll("(\\(.+\\))|(\\w+)", "T").length();
                    }
                    //System.out.println(programmeAlter);
                }
            }
        }
        //System.out.println(programmeTrouve);
        return programmeTrouve;
    }

    private ArrayList<ArrayList<Token>> obtenirDivisionExpressionsProgramme(List<Token> listToken, String programme) {
        ArrayList<String> structureLine = new ArrayList<>();
        listToken.forEach(e -> structureLine.add(e.obtenirNom()));

        ArrayList<String> structureProgramme = new ArrayList<>(Arrays.asList(programme.split(" ")));
        structureProgramme.removeIf(e -> e.equals("expression") || e.equals("#expression"));
        Iterator<String> iterProgramme = structureProgramme.iterator();

        ArrayList<ArrayList<Token>> expressionsList = new ArrayList<>();
        ArrayList<Token> programmeList = new ArrayList<>();

        if (programme.contains("expression") || programme.contains("#expression")) {
            String clef = iterProgramme.hasNext() ? iterProgramme.next() : "";

            ArrayList<Token> expressionList = new ArrayList<>();

            for (int i = 0; i < structureLine.size(); ++i) {
                if (structureLine.get(i).matches(clef)) {
                    clef = iterProgramme.hasNext() ? iterProgramme.next() : "";

                    programmeList.add(listToken.get(i));
                    expressionsList.add(expressionList);
                    expressionList = new ArrayList<>();
                } else {
                    expressionList.add(listToken.get(i));
                }
            }
            expressionsList.add(expressionList);
            expressionsList.removeIf(ArrayList::isEmpty);
        } else {
            programmeList = new ArrayList<>(listToken);
        }
        expressionsList.add(programmeList);
        return expressionsList;
    }
}

























