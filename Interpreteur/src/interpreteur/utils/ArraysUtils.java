package interpreteur.utils;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;

public class ArraysUtils {

    public static String join(String delemiter, Object[] array) {
        return String.join(delemiter, Arrays.stream(array).map(Object::toString).toArray(String[]::new));
    }

    @SuppressWarnings("unchecked")
    public static <T> T[] append(T[] array, T otherElement) {
        var ls = Arrays.asList(array);
        ls.add(otherElement);
        return (T[]) ls.toArray();
    }

    /**
     * @param list  the collection checked
     * @param open  the openning symbol
     * @param close the closing symbol
     * @return null if there are no openning symbol or the first openning symbol is before the last closing symbol
     */
    public static <T> Range enclose(List<T> list, final T open, final T close) {
        int start = list.indexOf(open);
        if (start == -1 || start > list.indexOf(close)) return null;
        int cptr = 1, idx = start + 1;
        for (; idx < list.size() && cptr != 0; idx++) {
            T currentElement = list.get(idx);
            cptr += currentElement.equals(open) ? 1 : currentElement.equals(close) ? -1 : 0;
        }
        return new Range(start, idx);
    }

}
