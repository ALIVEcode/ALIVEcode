package interpreteur.as.modules;

import interpreteur.as.modules.core.ASModuleFactory;
import interpreteur.as.modules.core.ASModuleManager;

public enum EnumModule {
    builtins(ModuleBuiltins::charger),
    Ast(ModuleAst::charger),
    Math(ModuleMath::charger),
    Voiture(ModuleVoiture::charger),
    Dict(ModuleDict::charger),
    Test(ModuleTest::charger),
    Ai(ModuleAI::charger),
    Iot(ModuleIoT::charger)
    ;

    EnumModule(ASModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
