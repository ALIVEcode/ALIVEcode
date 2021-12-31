package utils;

import interpreteur.utils.Range;
import interpreteur.utils.StringUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class StringUtilsTest {

    @Test
    void enclose() {
        String s1 = "(salut)", s1Open = "(", s1Close = ")"; // simple
        String s2 = "abc[[[[]]]aaa][]a", s2Open = "[", s2Close = "]"; // more complex
        String s3 = "  )()()() (", s3Open = "(", s3Close = ")"; // close before end
        String s4 = "abcdefghi(", s4Open = "(", s4Close = ")"; //

        // test s1
        Range result1 = StringUtils.enclose(s1, s1Open, s1Close);
        Range expected1 = new Range(0, s1.length());
        assertEquals(result1, expected1);

        Range result2 = StringUtils.enclose(s2, s2Open, s2Close);
        Range expected2 = new Range(3, 14);
        assertEquals(result2, expected2);

        Range result3 = StringUtils.enclose(s3, s3Open, s3Close);
        assertNull(result3);

        Range result4 = StringUtils.enclose(s4, s4Open, s4Close);
        assertNull(result4);

    }
}