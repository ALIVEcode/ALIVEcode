package generateurs.ast;

import interpreteur.as.ASAst;
import interpreteur.as.ASLexer;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Executeur;
import interpreteur.generateurs.ast.AstGenerator;
import interpreteur.tokens.Token;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class AstGeneratorTest {

    private static ASLexer lexer;

    @BeforeAll
    static void setup() {
        lexer = new ASLexer();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "",
            "()", "()()", "(() ())", "(mot() + mot())",
            "[]", "[][]", "[[] []]", "[mot[] + mot[]]",
            "{}"
    })
    void hasSafeSyntax(String line) {
        List<Token> tokenList = lexer.lex(line);
        Assertions.assertTrue(() -> {
            try {
                AstGenerator.hasSafeSyntax(tokenList.toArray(Token[]::new));
                return true;
            } catch (ASErreur.ErreurSyntaxe err) {
                return false;
            }
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "afficher ((decimal('12') + decimal('15.6')) / 2)"
    })
    void evalOneExpr(String line) {
        Executeur executeur = new Executeur();
        List<Token> tokenList = lexer.lex(line);
        ASAst ast = new ASAst(executeur);
        Programme result = ast.parse(tokenList);
        System.out.println(result);
    }

    @Test
    void eval() {
    }

    @Test
    void memeStructureProgramme() {
    }

    @Test
    void memeStructureExpression() {
    }

    @Test
    void ajouterProgramme() {
    }

    @Test
    void ajouterExpression() {
    }

    @Test
    void parse() {
    }

    @Test
    void obtenirProgramme() {
    }
}