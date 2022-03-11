package server.lintingApi;

import com.sun.net.httpserver.HttpExchange;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.modules.core.ASModuleManager;
import interpreteur.as.modules.EnumModule;
import interpreteur.generateurs.lexer.LexerLoader;
import interpreteur.generateurs.lexer.Regle;
import org.json.JSONArray;
import org.json.JSONObject;
import server.BaseApi;

import java.io.IOException;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ASLinterApi extends BaseApi {
    private final static ArrayList<Regle> REGLES;
    private final static ASModuleManager MODULE_MANAGER;
    private final static JSONObject LINTER_INFO;
    private final static String LINTER_INFO_STRING;
    private static Logger logger;

    static {
        MODULE_MANAGER = new ASModuleManager(null);
        var tmp = new LexerLoader(null);
        tmp.load();
        REGLES = tmp.getReglesAjoutees();
        LINTER_INFO = loadLinterInfo();
        LINTER_INFO_STRING = LINTER_INFO.toString();
    }

    public ASLinterApi(String CORS_ORIGIN) {
        super(CORS_ORIGIN);
    }

    public static void setLogger(Logger logger) {
        ASLinterApi.logger = logger;
    }

    public static JSONObject loadLinterInfo() {
        // adds all builtin functions
        List<String> fonctionsBuiltins = MODULE_MANAGER.getModuleBuiltins().getNomsConstantesEtFonctions();
        fonctionsBuiltins.remove("afficher");
        fonctionsBuiltins.remove("attendre");
        fonctionsBuiltins = fonctionsBuiltins
                .stream()
                .map(fct -> "\\b" + fct + "\\b")
                .collect(Collectors.toList());

        // adds all the name of the allowed modules
        List<String> modules = Stream.of(EnumModule.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        modules.add("\\b\"experimental\"\\b");

        List<String> commands = getPatternsOfCategory("commandes");
        // adds afficher to the commands and the command in the methode_moteur category
        commands.add("\\bafficher\\b");
        commands.add("\\battendre\\b");
        commands.remove("\\bconst\\b");
        commands.addAll(getPatternsOfCategory("methode_moteur"));

        List<String> operators = getPatternsOfCategory("arithmetique");
        operators.addAll(getPatternsOfCategory("assignements"));
        operators.add(getReglePattern("FLECHE"));
        operators.add(getReglePattern("DEUX_POINTS"));
        operators.addAll(getPatternsOfCategory("comparaison"));

        return new JSONObject()
                .put("datatype", Map.ofEntries(getMembersOfCategory("type_de_donnees")
                        .map(regle -> Map.entry(regle.getNom().toLowerCase(), regle.getPattern()))
                        .toArray(Map.Entry[]::new))
                )
                .put("datatypes_names", getPatternsOfCategory("nom_type_de_donnees"))
                .put("modules", modules)
                .put("blocs", getPatternsOfCategory("blocs"))
                .put("commands", commands)
                .put("logiques", new JSONArray(getPatternsOfCategory("porte_logique"))
                        .put(getReglePattern("PAS"))
                )
                .put("fonctions", getPatternsOfCategory("fonctions"))
                .put("fin", getReglePattern("FIN"))
                .put("fonctions_builtin", fonctionsBuiltins)
                .put("control_flow", new JSONArray(getPatternsOfCategory("control_flow")))
                .put("const", "\\bconst\\b")
                .put("variable", "[a-zA-Z_\\u00a1-\\uffff][a-zA-Z\\d_\\u00a1-\\uffff]*")
                .put("operators", operators);
    }

    private static List<String> getPatternsOfCategory(String nomCategorie) {
        return getMembersOfCategory(nomCategorie).map(Regle::getPattern).collect(Collectors.toList());
    }

    private static List<String> getNamesOfCategory(String nomCategorie) {
        return getMembersOfCategory(nomCategorie).map(regle -> regle.getNom().toLowerCase()).collect(Collectors.toList());
    }

    private static Stream<Regle> getMembersOfCategory(String nomCategorie) {
        return REGLES.stream().filter(regle -> regle.getCategorie().equals(nomCategorie));
    }

    private static String getReglePattern(String regleName) {
        return REGLES.stream().filter(regle -> regle.getNom().equals(regleName)).findFirst().orElseThrow().getPattern();
    }

    private static List<String> getMembersOfModule(String moduleName, boolean includeFunction, boolean includeVariables) {
        ArrayList<String> members = new ArrayList<>();
        ASModule module = MODULE_MANAGER.getModule(moduleName);
        if (includeFunction)
            members.addAll(module.getNomsFonctions().stream().map(name -> "\\b" + name + "\\b").collect(Collectors.toList()));
        if (includeVariables)
            members.addAll(module.getNomsVariables().stream().map(name -> "\\b" + name + "\\b").collect(Collectors.toList()));

        return members;
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        super.handle(httpExchange);

        String requestParamValue;

        requestParamValue = switch (httpExchange.getRequestMethod().toUpperCase()) {
            case "GET" -> handleGetRequest(httpExchange);
            case "POST" -> "{}";
            default -> "";
        };
        handleResponse(httpExchange, requestParamValue);
    }

    private String handleGetRequest(HttpExchange httpExchange) {
        logger.info("Collecting linter info...");
        logger.info("[SUCCESS] Linter info collected and sent successfuly");
        return LINTER_INFO_STRING;
    }
}




















