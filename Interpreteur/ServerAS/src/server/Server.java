package server;

import com.sun.net.httpserver.*;
import io.github.cdimascio.dotenv.Dotenv;
import server.executionApi.AliveScriptApi;
import server.executionApi.AliveScriptService;
import server.lintingApi.ASLinterApi;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Server {

    public static void main(String[] args) throws IOException {

        Dotenv env = Dotenv.configure()
                .directory("./.env")
                .load();

        final int PORT = Integer.parseInt(env.get("SERVER_PORT"));
        final String AS_URL = env.get("AS_URL");
        final int MAX_BACKLOG = Integer.parseInt(env.get("MAX_BACKLOG"));
        final String CORS_ORIGIN = env.get("CORS_ORIGIN") + ":" + env.get("HOST_PORT");
        final double maxServiceLifeSpan = Double.parseDouble(env.get("SESSION_LIFESPAN"));

        HttpServer server = HttpServer.create(new InetSocketAddress(AS_URL, PORT), MAX_BACKLOG);

        System.out.println("Starting server...");

        setupCleanUp(maxServiceLifeSpan);
        setupLogger(env.get("LOG_FILE_NAME"));

        AliveScriptApi aliveScriptApi = new AliveScriptApi(CORS_ORIGIN);
        HttpContext contextExecution = server.createContext("/" + env.get("COMPILE_PATH"));
        contextExecution.setHandler(aliveScriptApi);

        ASLinterApi asLinterApi = new ASLinterApi(CORS_ORIGIN);
        HttpContext contextLintInfo = server.createContext("/" + env.get("LINT_INFO_PATH"));
        contextLintInfo.setHandler(asLinterApi);


        System.out.println("Server listening on port " + PORT);
        System.out.println("Compile alivescript programs by sending a POST request to " + AS_URL + ":" + PORT + "/" + env.get("COMPILE_PATH") + "/"
                + " from " + env.get("CORS_ORIGIN") + ":" + env.get("HOST_PORT"));

        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(Integer.parseInt(env.get("THREAD_POOLS")));
        server.setExecutor(threadPoolExecutor);
        server.start();
    }

    public static void setupLogger(String fileName) throws IOException {
        var logger = Logger.getLogger(AliveScriptApi.class.getName());
        if (Files.notExists(Path.of("./log/"))) {
            Files.createDirectory(Path.of("./log/"));
        }
        FileHandler fileHandler = new FileHandler("./log/" + fileName, true);
        logger.addHandler(fileHandler);
        fileHandler.setFormatter(new SimpleFormatter());
        AliveScriptApi.setLogger(logger);
        ASLinterApi.setLogger(logger);
    }

    public static void setupCleanUp(final double maxServiceLifeSpan) {
        AliveScriptService.setMaxServiceLifeSpan(maxServiceLifeSpan);

        new Timer("clean up", true).scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                AliveScriptService.updateAndCleanUp();
            }
        }, 1000L, 1000L);
    }
}
