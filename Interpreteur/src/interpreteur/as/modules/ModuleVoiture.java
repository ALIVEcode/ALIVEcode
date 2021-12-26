package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;
import interpreteur.executeur.Executeur;
import org.json.JSONObject;

import java.util.function.Function;

public class ModuleVoiture {

    private static Object getDataVoiture(String parametre) {
        JSONObject dataVoiture = DataVoiture.getDataVoiture();
        if (dataVoiture == null) {
            DataVoiture.requestDataVoiture();
            throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("car"));
        } else {
            return dataVoiture.get(parametre);
        }
    }

    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[]{

                new ASObjet.Fonction("x", new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("x")).doubleValue());
                    }
                },

                new ASObjet.Fonction("y",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("y")).doubleValue());
                    }
                },

                new ASObjet.Fonction("getDistAvant",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dA")).doubleValue());
                    }
                },
                new ASObjet.Fonction("getDistGauche",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dG")).doubleValue());
                    }
                },
                new ASObjet.Fonction("getDistDroite",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dD")).doubleValue());
                    }
                },

                new ASObjet.Fonction("rouler", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("entier"), "vitesseGauche", null),
                        new ASObjet.Fonction.Parametre(new Type("entier"), "vitesseDroite", null)
                },  new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        throw new ASErreur.StopSetInfo(new Data(Data.Id.ROULER)
                                .addParam(this.getValeurParam("vitesseGauche"))
                                .addParam(this.getValeurParam("vitesseDroite")));
                    }
                }

        }, new ASObjet.Variable[]{
                new ASObjet.Variable("vitesse", new ASObjet.Entier(10), new Type("tout"))
                        .setGetter(() -> new ASObjet.Decimal(((Number) getDataVoiture("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new ASObjet.Variable("distAvant", new ASObjet.Entier(10), new Type("tout"))
                        .setGetter(() -> new ASObjet.Decimal(((Number) getDataVoiture("dA")).doubleValue()))
                        .setReadOnly()
        });
    }
}
