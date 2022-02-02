package interpreteur.as.modules;

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

    EnumModule(ModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
