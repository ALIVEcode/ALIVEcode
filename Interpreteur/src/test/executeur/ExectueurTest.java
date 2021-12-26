package test.executeur;

import interpreteur.executeur.Executeur;
import interpreteur.generateurs.ast.AstGenerator;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

public class ExectueurTest {

    @Test
    public void test() {
        String[] lines = """   
                var nb = "12"
                var nb2 = "74"
                                
                afficher((decimal(nb) + decimal(nb2)) / 2)
                                
                utiliser Math
                                
                afficher Math.sin(Math.PI)
                                
                """.split("\n");
        Executeur reference = new Executeur();
        var expression = new ArrayList<>(AstGenerator.getOrdreExpressions());
        var programmes = new ArrayList<>(AstGenerator.getOrdreProgrammes());

        for (int i = 0; i < 20; i++) {
            Executeur executeur = new Executeur();
            Object a;
            if (!(a = executeur.compiler(lines, true)).equals("[]")) System.out.println(a);
            System.out.println(executeur.executerMain(false));
            Assertions.assertEquals(expression, AstGenerator.getOrdreExpressions());
            Assertions.assertEquals(programmes, AstGenerator.getOrdreProgrammes());
        }
    }
}
