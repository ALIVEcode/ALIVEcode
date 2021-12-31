package executeur;

import interpreteur.executeur.Executeur;
import interpreteur.generateurs.ast.AstGenerator;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import result.Result;

import java.util.ArrayList;

public class ExectueurTest {

    @Test
    public void test() {
        String[] lines = """   
                var nb = "12"
                var nb2 = "74"
                                
                afficher((decimal(nb) + decimal(nb2)) / 2)
                                
                utiliser Math
                                
                afficher Math.sin(90)
                                
                """.split("\n");

        Executeur executeur = new Executeur();
        Object a = executeur.compiler(lines, true);
        Assertions.assertNotEquals("[]", a, a.toString());

        var result = executeur.executerMain(false);
        new Result(result).expectTo(
                Result.printMsg((12 + 74) / 2.0),
                Result.printMsg(Math.sin(Math.toRadians(90))),
                Result.endExecution()
        );
        System.out.println(result);
    }
}

















