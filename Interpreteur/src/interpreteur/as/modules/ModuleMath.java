package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;


public class ModuleMath {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[]{
                new ASObjet.Fonction("rad", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.toRadians(angle));
                    }
                },

                new ASObjet.Fonction("deg", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.toDegrees(angle));
                    }
                },

                new ASObjet.Fonction("sin", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.sin(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("cos", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.cos(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("tan", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.tan(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("arrondir", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "n", null),
                        new ASObjet.Fonction.Parametre(new Type("entier"), "nbSignificatifs", new ASObjet.Entier(0)),
                }, new Type("nombre")) {
                    @Override
                    public ASObjet<?> executer() {
                        double n = ((Number) this.getValeurParam("n").getValue()).doubleValue();
                        double shift = Math.pow(10, (Integer) this.getValeurParam("nbSignificatifs").getValue());
                        return new Decimal(Math.round(n * shift) / shift);
                    }
                },
        }, new ASObjet.Variable[]{
                new ASObjet.Constante("PI", new ASObjet.Decimal(Math.PI)),
                new ASObjet.Constante("E", new ASObjet.Decimal(Math.E))
        });
    }
}
