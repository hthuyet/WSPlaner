package com.wsplanning.webapp.utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.wsplanning.webapp.controllers.CommonController;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class Utils {
  private static Logger logger = LoggerFactory.getLogger(CommonController.class);

  public static String getAsString(JsonObject obj, String key, String defaultValue) {
    if (obj.get(key) == null || obj.get(key).isJsonNull()) {
      return defaultValue;
    }
    return obj.get(key).getAsString();
  }

  public static Integer getAsInt(JsonObject obj, String key, Integer defaultValue) {
    if (obj.get(key) == null || obj.get(key).isJsonNull()) {
      return defaultValue;
    }
    return obj.get(key).getAsInt();
  }

  public static Long getAsLong(JsonObject obj, String key, Long defaultValue) {
    if (obj.get(key) == null || obj.get(key).isJsonNull()) {
      return defaultValue;
    }
    return obj.get(key).getAsLong();
  }

  public static JsonObject getAsJsonObject(JsonObject obj, String key, JsonObject defaultValue) {
    if (obj.get(key) == null || obj.get(key).isJsonNull()) {
      return defaultValue;
    }
    return obj.get(key).getAsJsonObject();
  }

  public static JsonArray getAsJsonArray(JsonObject obj, String key, JsonArray defaultValue) {
    if (obj.get(key) == null || obj.get(key).isJsonNull()) {
      return defaultValue;
    }
    return obj.get(key).getAsJsonArray();
  }

  public static String getAsString(Map<String, String> maps, String key, String defaultValue) {
    String rtn = maps.get(key);
    if (rtn == null) {
      return defaultValue;
    }
    return rtn;
  }

  public static Integer getAsInt(Map<String, String> maps, String key, Integer defaultValue) {
    String rtn = maps.get(key);
    if (rtn == null || !StringUtils.isNumeric(rtn)) {
      return defaultValue;
    }
    return Integer.parseInt(rtn);
  }

  public static Long getAsLong(Map<String, String> maps, String key, Long defaultValue) {
    String rtn = maps.get(key);
    if (rtn == null || !StringUtils.isNumeric(rtn)) {
      return defaultValue;
    }
    return Long.parseLong(rtn);
  }

  public static Boolean getAsBoolean(Map<String, String> maps, String key, Boolean defaultValue) {
    String rtn = maps.get(key);
    if (rtn == null || StringUtils.isBlank(rtn)) {
      return defaultValue;
    }
    return Boolean.parseBoolean(rtn);
  }

  static DateTimeFormatter formatterInput = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

  public static String formateDateAPI(String input) {
    if (input == null || StringUtils.isBlank(input)) {
      return "";
    }
    try {
      if (input.contains("T")) {
        input = input.substring(0, input.indexOf("T"));
      }
      LocalDate dateTime = LocalDate.parse(input, formatterInput);
      return dateTime.format(formatter);
    } catch (Exception ex) {
      logger.error(String.format("ERROR formateDateAPI {%s}", input), ex);
      ex.printStackTrace();
      return "";
    }
  }


  public static byte[] readFileInResource(String fileName) throws IOException {
    ClassLoader classLoader = Utils.class.getClassLoader();
    InputStream stream = classLoader.getResourceAsStream(fileName);
    if (stream == null) {
      logger.warn(String.format("File: %s not exits!", fileName));
      stream = Utils.class.getResourceAsStream(fileName);
    }
    if (stream == null) {
      logger.error(String.format("File: %s not exits!", fileName));
      return null;
    }
    return IOUtils.toByteArray(classLoader.getResourceAsStream(fileName));
  }

  public static String encodeFileToBase64AtResource2(String fileName) throws IOException {
    ClassLoader classLoader = Utils.class.getClassLoader();
    InputStream stream = classLoader.getResourceAsStream(fileName);
    if (stream == null) {
      logger.warn(String.format("File: %s not exits!", fileName));
      stream = Utils.class.getResourceAsStream(fileName);
    }
    if (stream == null) {
      logger.error(String.format("File: %s not exits!", fileName));
      return "";
    }
    byte[] encoded = Base64.encodeBase64(IOUtils.toByteArray(classLoader.getResourceAsStream(fileName)));
    return new String(encoded, StandardCharsets.UTF_8);
  }

  public static String encodeFileToBase64AtResource(String fileName) throws IOException {
    Resource resourceFile = new ClassPathResource("classpath:" + fileName);
    byte[] encoded = Base64.encodeBase64(IOUtils.toByteArray(resourceFile.getInputStream()));
    return new String(encoded, StandardCharsets.UTF_8);
  }

  public static String encodeFileToBase64Binary(String fileName) throws IOException {
    File file = new File(fileName);
    byte[] encoded = Base64.encodeBase64(FileUtils.readFileToByteArray(file));
    return new String(encoded, StandardCharsets.UTF_8);
  }

  public static void main(String[] args) {
    System.out.println(formateDateAPI("2018-01-17T17:00:00.000Z"));
  }
}
