package interpreteur.as.modules.builtins;

import interpreteur.as.lang.ASConstante;
import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.datatype.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASTypeBuiltin;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.ASType;
import interpreteur.executeur.Executeur;

import java.util.*;

public class BuiltinsListeUtils {

    public static ASFonctionModule[] fonctions = new ASFonctionModule[]{
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
            new ASFonctionModule("liste", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.texte.asType(), "txt", null),
            }, new ASType("liste")) {
                @Override
                public ASObjet<?> executer() {
                    ASTexte texte = (ASTexte) this.getParamsValeursDict().get("txt");
                    return new ASListe(texte.arrayDeLettres());
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
            new ASFonctionModule("inv", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.iterable.asType(), "iter", null),
            }, new ASType("iterable")) {
                @Override
                public ASObjet<?> executer() {
                    ASIterable element = (ASIterable) this.getValeurParam("iter");
                    if (element instanceof ASListe) {
                        ASListe newListe = new ASListe();
                        for (int i = element.taille() - 1; i >= 0; i--) newListe.ajouterElement(element.get(i));
                        return newListe;
                    } else {
                        StringBuilder inv = new StringBuilder();
                        for (int i = element.taille() - 1; i >= 0; i--) inv.append(element.get(i).toString());
                        return new ASTexte(inv.toString());
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
            new ASFonctionModule("map", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(new ASType("fonction"), "f", null),
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst", null)
            }, new ASType("liste")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    ASListe nouvelleListe;
                    ASObjet<?> f = this.getParamsValeursDict().get("f");
                    if (f instanceof ASFonction fonction) {
                        nouvelleListe = new ASListe(liste.getValue().stream().map(element -> fonction
                                        .makeInstance()
                                        .executer(new ArrayList<>(List.of((ASObjet<?>) element))))
                                .toArray(ASObjet[]::new));

                    } else {
                        nouvelleListe = new ASListe(liste.getValue().stream().map(element -> ((ASFonctionModule) f)
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
            new ASFonctionModule("filtrer", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.fonctionType.asType(), "f", null),
                    new ASFonctionModule.Parametre(ASTypeBuiltin.liste.asType(), "lst", null)
            }, new ASType("liste")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    ASListe nouvelleListe;
                    ASObjet<?> f = this.getParamsValeursDict().get("f");

                    if (f instanceof ASFonction fonction) {
                        nouvelleListe = new ASListe(liste.getValue().stream().filter(element -> fonction
                                        .makeInstance()
                                        .executer(new ArrayList<>(List.of((ASObjet<?>) element)))
                                        .boolValue())
                                .toArray(ASObjet[]::new));

                    } else {
                        nouvelleListe = new ASListe(liste.getValue().stream().filter(element -> ((ASFonctionModule) f)
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
            new ASFonctionModule("joindre", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.liste.asType(), "lst", null),
                    new ASFonctionModule.Parametre(ASTypeBuiltin.texte.asType(), "separateur", new ASTexte(""))
            }, new ASType("texte")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    ASTexte separateur = (ASTexte) this.getParamsValeursDict().get("separateur");
                    return new ASTexte(
                            String.join(
                                    separateur.getValue(),
                                    liste.getValue().stream().map(Object::toString).toArray(String[]::new)
                            )
                    );
                }
            },

            new ASFonctionModule("somme", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst", null)
            }, new ASType("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    double somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).sum();
                    return new ASDecimal(somme);
                }
            },

            new ASFonctionModule("max", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst", null)
            }, new ASType("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    OptionalDouble somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).max();
                    if (somme.isEmpty()) {
                        throw new ASErreur.ErreurComparaison("tous les \u00E9l\u00E9ments de la liste doivent être des nombres pour pouvoir obtenir le maximum");
                    }
                    return new ASDecimal(somme.getAsDouble());
                }
            },

            new ASFonctionModule("min", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst", null)
            }, new ASType("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste = (ASListe) this.getParamsValeursDict().get("lst");
                    OptionalDouble somme = liste.getValue().stream().mapToDouble(e -> ((Number) e.getValue()).doubleValue()).min();
                    if (somme.isEmpty()) {
                        throw new ASErreur.ErreurComparaison("tous les \u00E9l\u00E9ments de la liste doivent être des nombres pour pouvoir obtenir le minimum");
                    }
                    return new ASDecimal(somme.getAsDouble());
                }
            },

            /*
             * Agit comme un addAll
             */
            new ASFonctionModule("unir", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst1", null),
                    new ASFonctionModule.Parametre(new ASType("liste"), "lst2", null)
            }, new ASType("liste")) {
                @Override
                public ASObjet<?> executer() {
                    ASListe liste1 = (ASListe) this.getParamsValeursDict().get("lst1");
                    ASListe liste2 = (ASListe) this.getParamsValeursDict().get("lst2");
                    ASListe newListe = new ASListe();
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
            new ASFonctionModule("tailleDe", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.iterable.asType(), "iter", null)
            }, new ASType("entier")) {
                @Override
                public ASObjet<?> executer() {
                    ASIterable val = (ASIterable) this.getParamsValeursDict().get("iter");
                    return new ASEntier(val.taille());
                }
            },

            new ASFonctionModule("indexDe", new ASFonctionModule.Parametre[]{
                    new ASFonctionModule.Parametre(ASTypeBuiltin.tout.asType(), "valeur", null),
                    new ASFonctionModule.Parametre(ASTypeBuiltin.iterable.asType(), "iter", null)
            }, new ASType("entier")) {
                @Override
                public ASObjet<?> executer() {
                    ASIterable iter = (ASIterable) this.getParamsValeursDict().get("iter");
                    ASObjet<?> val = this.getParamsValeursDict().get("valeur");
                    int idx;
                    if (iter instanceof ASTexte txt && val instanceof ASTexte txtVal) {
                        idx = txt.getValue().indexOf(txtVal.getValue());
                    } else if (iter instanceof ASListe lst) {
                        idx = lst.getValue().indexOf(val);
                    } else {
                        throw new ASErreur.ErreurType("La valeur doit \u00EAtre de type texte lorsque l'on recherche " +
                                "l'index d'un \u00E9l\u00E9ment de type texte");
                    }
                    return idx != -1 ? new ASEntier(idx) : new ASNul();
                }
            }
    };


    public static List<ASConstante> constantes = Collections.emptyList();


    public ASModule charger(Executeur executeurInstance) {
        return null;
    }
}














