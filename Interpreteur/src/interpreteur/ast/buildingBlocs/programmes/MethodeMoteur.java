package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.Nombre;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;


public class MethodeMoteur extends Programme {
    private final String nom;
    private final Expression<?> valeur;

    public MethodeMoteur(String nom, Expression<?> valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }

    @Override
    public Object execute() {
        if (this.valeur != null && !(this.valeur.eval() instanceof Nombre)) {
            throw new ASErreur.ErreurType("Le param\u00E8tres 'temps' est de type 'nombre'," +
                    " mais l'argument pass\u00E9 est de type '" + this.valeur.eval().obtenirNomType() + "'.");
        }

        double valeur = this.valeur != null ? ((Number) this.valeur.eval().getValue()).doubleValue() : 0;
        double dodo = 0;
        DataVoiture.dataVoitureHasChanged();

        Data.Id id = switch (nom) {
            case "AVANCER" -> {
                // avancer avec moteur
                dodo = valeur;
                yield Data.Id.AVANCER;
            }

            case "RECULER" -> {
                // reculer avec moteur
                dodo = valeur;
                yield Data.Id.RECULER;
            }

            case "ARRETER" -> // arreter avec moteur
                    Data.Id.ARRETER;

            case "TOURNER_DROITE" -> {
                valeur = this.valeur != null ? valeur * -1 : -90;
                yield Data.Id.TOURNER;
            }
            case "TOURNER_GAUCHE" -> {
                valeur = this.valeur != null ? valeur : 90;
                yield Data.Id.TOURNER;
            }

            default -> throw new IllegalStateException("Unexpected value: " + nom);
        };

        return new Data(id).addParam(valeur).addDodo(dodo);
    }
}
