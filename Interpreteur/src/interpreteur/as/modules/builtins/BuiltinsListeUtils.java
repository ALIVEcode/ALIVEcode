package interpreteur.as.modules.builtins;

import interpreteur.as.Objets.ASFonction;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.as.modules.ASModule;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

import java.util.*;

public class BuiltinsListeUtils {

    public static ASObjet.Fonction[] fonctions = new ASObjet.Fonction[]{
            /*
             * sep:
             * 		@param t:
             * 			-> type: texte
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour liste
             *
             * 		@return une liste où chaque élément est la lettre du string passé en paramètre
             */
            new ASObjet.Fonction("liste", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
            }, new Type("liste")) {
                @Override
                public ASObjet<?> executer() {
                    Texte texte = (Texte) this.getParamsValeursDict().get("txt");
                    return new Liste(texte.arrayDeLettres());
                }
            },

            /*
             * inv: (inverser)
             * 		@param t:
             * 			-> type: lst
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour iterable
             *
             * 		@return un iterable où chaque élément est inversé
             */
            new ASObjet.Fonction("inv", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.iterable.asType(), "iter", null),
            }, new Type("iterable")) {
                @Override
                public ASObjet<?> executer() {
                    Iterable element = (Iterable) this.getValeurParam("iter");
                    if (element instanceof Liste) {
                        Liste newListe = new Liste();
                        for (int i = element.taille() - 1; i >= 0; i--) newListe.ajouterElement(element.get(i));
                        return newListe;
                    } else {
                        StringBuilder inv = new StringBuilder();
                        for (int i = element.taille() - 1; i >= 0; i--) inv.append(element.get(i).toString());
                        return new Texte(inv.toString());
                    }
                }
            },

            /*
             * map:
             * 		@param f:
             * 			-> type: fonction
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@param l:
             * 			-> type: liste
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour liste
             *
             * 		@return la liste formee suite a l'application de la fonction sur chaque element de la liste
             */
            new ASObjet.Fonction("map", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("fonction"), "f", null),
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst", null)
            }, new Type("liste")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    Liste nouvelleListe;
                    ASObjet<?> f = this.getParamsValeursDict().get("f");
                    if (f instanceof ASFonction fonction) {
                        nouvelleListe = new Liste(liste.getValue().stream().map(element -> fonction
                                        .makeInstance()
                                        .executer(new ArrayList<>(List.of((ASObjet<?>) element))))
                                .toArray(ASObjet[]::new));

                    } else {
                        nouvelleListe = new Liste(liste.getValue().stream().map(element -> ((ASObjet.Fonction) f)
                                        .setParamPuisExecute(new ArrayList<>(List.of((ASObjet<?>) element))))
                                .toArray(ASObjet[]::new));
                    }
                    return nouvelleListe;
                }
            },

            /*
             * filtrer:
             * 		@param f:
             * 			-> type: fonction (doit retourner un booleen)
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@param l:
             * 			-> type: liste
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour liste
             *
             * 		@return la liste formee des elements de la liste initiale pour lesquels la fonction f a retourne vrai
             */
            new ASObjet.Fonction("filtrer", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.fonctionType.asType(), "f", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.liste.asType(), "lst", null)
            }, new Type("liste")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    Liste nouvelleListe;
                    ASObjet<?> f = this.getParamsValeursDict().get("f");

                    if (f instanceof ASFonction fonction) {
                        nouvelleListe = new Liste(liste.getValue().stream().filter(element -> fonction
                                        .makeInstance()
                                        .executer(new ArrayList<>(List.of((ASObjet<?>) element)))
                                        .boolValue())
                                .toArray(ASObjet[]::new));

                    } else {
                        nouvelleListe = new Liste(liste.getValue().stream().filter(element -> ((ASObjet.Fonction) f)
                                        .setParamPuisExecute(new ArrayList<>(List.of((ASObjet<?>) element)))
                                        .boolValue())
                                .toArray(ASObjet[]::new));
                    }
                    return nouvelleListe;
                }
            },

            /*
             * joindre:
             * 		@param lst:
             * 			-> type: liste
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@param separateur:
             * 			-> type: texte
             * 			-> valeur par defaut: " "
             *
             * 		@type_retour texte
             *
             * 		@return le texte forme en joignant chaque elements de la liste initiale avec le separateur entre chaque element
             */
            new ASObjet.Fonction("joindre", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.liste.asType(), "lst", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "separateur", new ASObjet.Texte(""))
            }, new Type("texte")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    Texte separateur = (Texte) this.getParamsValeursDict().get("separateur");
                    return new Texte(
                            String.join(
                                    separateur.getValue(),
                                    liste.getValue().stream().map(Object::toString).toArray(String[]::new)
                            )
                    );
                }
            },

            new ASObjet.Fonction("somme", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst", null)
            }, new Type("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    double somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).sum();
                    return new Decimal(somme);
                }
            },

            new ASObjet.Fonction("max", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst", null)
            }, new Type("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    OptionalDouble somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).max();
                    if (somme.isEmpty()) {
                        throw new ASErreur.ErreurComparaison("tous les \u00E9l\u00E9ments de la liste doivent être des nombres pour pouvoir obtenir le maximum");
                    }
                    return new Decimal(somme.getAsDouble());
                }
            },

            new ASObjet.Fonction("min", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst", null)
            }, new Type("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste = (Liste) this.getParamsValeursDict().get("lst");
                    OptionalDouble somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).min();
                    if (somme.isEmpty()) {
                        throw new ASErreur.ErreurComparaison("tous les \u00E9l\u00E9ments de la liste doivent être des nombres pour pouvoir obtenir le minimum");
                    }
                    return new Decimal(somme.getAsDouble());
                }
            },

            /*
             * Agit comme un addAll
             */
            new ASObjet.Fonction("unir", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst1", null),
                    new ASObjet.Fonction.Parametre(new Type("liste"), "lst2", null)
            }, new Type("liste")) {
                @Override
                public ASObjet<?> executer() {
                    Liste liste1 = (Liste) this.getParamsValeursDict().get("lst1");
                    Liste liste2 = (Liste) this.getParamsValeursDict().get("lst2");
                    Liste newListe = new Liste();
                    return newListe.ajouterTout(liste1).ajouterTout(liste2);
                }
            },

            /*
             * tailleDe:
             * 		@param objet:
             * 			-> type: liste ou texte
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour entier
             *
             * 		@return -> si "choix" est de type liste: le nombre d'element dans la liste
             * 				-> si "choix" est de type texte: le nombre de caractere dans le texte
             */
            new ASObjet.Fonction("tailleDe", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.iterable.asType(), "iter", null)
            }, new Type("entier")) {
                @Override
                public ASObjet<?> executer() {
                    Iterable val = (Iterable) this.getParamsValeursDict().get("iter");
                    return new Entier(val.taille());
                }
            },

            new ASObjet.Fonction("indexDe", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.tout.asType(), "valeur", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.iterable.asType(), "iter", null)
            }, new Type("entier")) {
                @Override
                public ASObjet<?> executer() {
                    Iterable iter = (Iterable) this.getParamsValeursDict().get("iter");
                    ASObjet<?> val = this.getParamsValeursDict().get("valeur");
                    int idx;
                    if (iter instanceof Texte txt && val instanceof Texte txtVal) {
                        idx = txt.getValue().indexOf(txtVal.getValue());
                    } else if (iter instanceof Liste lst) {
                        idx = lst.getValue().indexOf(val);
                    } else {
                        throw new ASErreur.ErreurType("La valeur doit \u00EAtre de type texte lorsque l'on recherche " +
                                "l'index d'un \u00E9l\u00E9ment de type texte");
                    }
                    return idx != -1 ? new Entier(idx) : new Nul();
                }
            }
    };


    public static List<ASObjet.Constante> constantes = Collections.emptyList();


    public ASModule charger(Executeur executeurInstance) {
        return null;
    }
}














