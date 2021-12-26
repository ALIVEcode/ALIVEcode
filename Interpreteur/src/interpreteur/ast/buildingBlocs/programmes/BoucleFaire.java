package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.executeur.Executeur;

public class BoucleFaire extends Boucle {
    protected BoucleFaire(String nomBoucle, Executeur executeurInstance) {
        super(nomBoucle, executeurInstance);
    }

    @Override
    public Object execute() {
        assert this.executeurInstance != null;
        this.executeurInstance.obtenirCoordRunTime().nouveauBloc("faire");
        return null;
    }

    @Override
    public void sortir() {

    }
}
