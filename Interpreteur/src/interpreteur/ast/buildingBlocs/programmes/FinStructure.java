package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.managers.ASFonctionManager;
import interpreteur.ast.buildingBlocs.Programme;

public class FinStructure extends Programme {

    public FinStructure() {
        ASFonctionManager.retirerStructure();
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public String toString() {
        return "FinStructure";
    }
}
