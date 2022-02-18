package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.datatype.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASTypeBuiltin;
import interpreteur.as.modules.core.ASModule;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

public class ModuleIoT {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[] {
                new ASFonctionModule("update",
                        new ASFonctionModule.Parametre[] {
                            new ASFonctionModule.Parametre(
                                    ASTypeBuiltin.texte.asType(),
                                    "projectId",
                                    null
                            ),
                            new ASFonctionModule.Parametre(
                                    ASTypeBuiltin.texte.asType(),
                                    "id",
                                    null
                            ),
                            new ASFonctionModule.Parametre(
                                    ASTypeBuiltin.tout.asType(),
                                    "value",
                                    null
                            )
                        }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASTexte projectId = (ASTexte) this.getValeurParam("projectId");
                        ASTexte id = (ASTexte) this.getValeurParam("id");
                        ASObjet<?> valueAs = (ASObjet<?>) this.getValeurParam("value");

                        executeurInstance.addData(new Data(Data.Id.UPDATE_COMPONENT).addParam(projectId).addParam(id).addParam(valueAs.getValue()));
                        return new ASNul();
                    }
                },
                new ASFonctionModule("get",
                        new ASFonctionModule.Parametre[] {
                                new ASFonctionModule.Parametre(
                                        ASTypeBuiltin.texte.asType(),
                                        "key",
                                        new ASNul()
                                )
                        }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> uncastedKey = (ASObjet<?>) this.getValeurParam("key");
                        if(uncastedKey instanceof ASNul) {
                            return new ASTexte(executeurInstance.getContext().toString());
                        }

                        ASTexte key = (ASTexte) uncastedKey;

                        Object obj = executeurInstance.getContext().get(key.toString());
                        if(obj == null) {
                            throw new ModuleIoT.KeyNotPresent("Erreur, la clé " + key + " n'est pas présente dans l'objet de réponse.");
                        }
                        if(obj instanceof String) {
                            return new ASTexte(obj);
                        }
                        if(obj instanceof Number) {
                            return ASNombre.cast((Number) obj);
                        }
                        if(obj instanceof Boolean) {
                            return new ASBooleen((Boolean) obj);
                        }
                        return new ASNul();
                    }
                },
                new ASFonctionModule("getComponentValue",
                        new ASFonctionModule.Parametre[] {
                                new ASFonctionModule.Parametre(
                                        ASTypeBuiltin.texte.asType(),
                                        "projectId",
                                        null
                                ),
                                new ASFonctionModule.Parametre(
                                        ASTypeBuiltin.texte.asType(),
                                        "id",
                                        null
                                )
                        }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASNul();
                    }
                }
        });
    }

    private static class KeyNotPresent extends ASErreur.ErreurAliveScript {
        public KeyNotPresent(String message) {
            super(message, "ErreurCleDansContexte");
        }
    }
}
