package result;

import interpreteur.data_manager.Data;
import interpreteur.utils.ArraysUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;
import java.util.stream.IntStream;

public record Result(JSONArray resultData) {

    public static Data print(Object message) {
        return new Data(Data.Id.AFFICHER).addParam(message.toString());
    }

    public static Data waitDelay(int delay) {
        return new Data(Data.Id.ATTENDRE).addParam(delay);
    }

    public static Data getAttribute(String attributeName) {
        return new TestData(Data.Id.GET, TestData.Modifier.TEST_ONLY_FIRST_PARAM).addParam(attributeName);
    }

    public static Data throwErr(String errorName) {
        return new TestData(Data.Id.ERREUR, TestData.Modifier.TEST_ONLY_FIRST_PARAM).addParam(errorName);
    }

    public static Data throwErrWithMsg(String errorName, String message) {
        return new TestData(Data.Id.ERREUR, TestData.Modifier.TEST_ONLY_FIRST_2_PARAMS)
                .addParam(errorName)
                .addParam(message);
    }

    public static Data haveData(Data data) {
        return data;
    }

    public static Data end() {
        return Data.endOfExecution();
    }

    //----------------- car movement -----------------//

    public static Data carForeward(Integer duration) {
        return new Data(Data.Id.AVANCER).addParam(duration).addDodo(Objects.requireNonNullElse(duration, 0));
    }

    public static Data carBackward(Integer duration) {
        return new Data(Data.Id.RECULER).addParam(duration).addDodo(Objects.requireNonNullElse(duration, 0));
    }

    public static Data carLeft(int duration) {
        return new Data(Data.Id.TOURNER_GAUCHE).addParam(duration);
    }

    public static Data carRight(int duration) {
        return new Data(Data.Id.TOURNER_DROITE).addParam(duration);
    }

    public static Data carStop(int duration) {
        return new Data(Data.Id.ARRETER).addParam(duration);
    }

    //----------------- end car movement -----------------//

    public void expectToEndAfter(Data... actions) {
        actions = ArraysUtils.append(actions, end());
        Assert.assertArrayEquals(actions, IntStream.range(0, resultData.length()).mapToObj(resultData::get).toArray());
    }

    public void expectTo(Data... actions) {
        Assert.assertArrayEquals(actions, IntStream.range(0, resultData.length()).mapToObj(resultData::get).toArray());
    }

    private static final class TestData extends Data {
        private final Modifier modifier;

        public TestData(Data.Id id, Modifier modifier) {
            super(id);
            this.modifier = modifier;
        }

        public TestData(Data.Id id) {
            super(id);
            this.modifier = Modifier.TEST_ALL;
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof JSONObject data)) return false;
            var arrData = data.getJSONArray("p");
            return switch (modifier) {
                case TEST_ONLY_FIRST_PARAM -> {
                    var newData = new JSONObject(data)
                            .put("p", new JSONArray()
                                    .put(arrData.get(0))
                            );
                    yield super.equals(newData);
                }
                case TEST_ONLY_FIRST_2_PARAMS -> {
                    var newData = new JSONObject(data)
                            .put("p", new JSONArray()
                                    .put(arrData.get(0))
                                    .put(arrData.get(1))
                            );
                    yield super.equals(newData);
                }
                case TEST_ALL -> super.equals(o);
            };
        }

        enum Modifier {
            TEST_ONLY_FIRST_PARAM,
            TEST_ONLY_FIRST_2_PARAMS,
            TEST_ALL
        }
    }
}

