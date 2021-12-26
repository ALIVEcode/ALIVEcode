package server;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;

public abstract class BaseApi implements HttpHandler {
    protected final String CORS_ORIGIN;

    protected BaseApi(String CORS_ORIGIN) {
        this.CORS_ORIGIN = CORS_ORIGIN;
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Headers headers = httpExchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", CORS_ORIGIN);
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
        headers.set("Content-Type", "application/json");
    }

    protected JSONObject byteArrayToJson(byte[] byteArray) {
        StringBuilder inputData = new StringBuilder();
        for (byte b : byteArray) {
            inputData.append((char) b);
        }
        return new JSONObject(inputData.toString());
    }

    protected void handleResponse(HttpExchange httpExchange, String requestParamValue) throws IOException {

        OutputStream outputStream = httpExchange.getResponseBody();
        byte[] responseBytes = requestParamValue.getBytes();

        // this line is a must
        httpExchange.sendResponseHeaders(200, responseBytes.length);
        outputStream.write(responseBytes);

        outputStream.flush();

        outputStream.close();

    }
}
