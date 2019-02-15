package com.wsplanning.webapp.controllers;

import com.google.gson.*;
import com.wsplanning.webapp.clients.WokOrderClient;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class WOController extends BaseController {
  private Logger logger = LoggerFactory.getLogger(WOController.class);

  @Autowired
  protected WokOrderClient wokOrderClient;

  @Autowired
  protected HttpSession session;

  @Autowired
  HttpSession httpSession;

  Gson gson = new Gson();

  @PostMapping("/wo/countWO")
  @ResponseBody
  public ResponseEntity countWO(@RequestBody Map<String, String> params) {
    try {
      String rtn = wokOrderClient.countWO(getToken(), getSiteId(), params);
      return new ResponseEntity<>(rtn, HttpStatus.OK);
    } catch (Exception ex) {
      return parseException(ex);
    }
  }

  @PostMapping("/wo/getWO")
  @ResponseBody
  public ResponseEntity getWO(@RequestBody Map<String, String> params) {
    try {
      String rtn = wokOrderClient.getWO(getToken(), getSiteId(), params);
      if (rtn != null && StringUtils.isNotBlank(rtn)) {
        //JsonParser
        JsonParser parser = new JsonParser();
        JsonElement tradeElement = parser.parse(rtn);
        JsonArray listData = tradeElement.getAsJsonArray();

        //Init list
        JsonArray listRtn = new JsonArray();
        JsonObject itemRtn = null;

        //Init variable
        JsonObject itemObj = null;
        JsonObject WOVehicle = null;
        JsonObject HolderCustomer = null;
        JsonObject WOCustomer = null;
        StringBuilder sb = new StringBuilder();
        String jobTitle = "";

        for (JsonElement item : listData) {
          HolderCustomer = null;
          sb = new StringBuilder();
          sb.setLength(0);

          itemObj = item.getAsJsonObject();
          jobTitle = itemObj.get("JobTitle").getAsString();

          if (itemObj.has("WOVehicle") && !itemObj.get("WOVehicle").isJsonNull()) {
            WOVehicle = itemObj.get("WOVehicle").getAsJsonObject();
            sb.append(WOVehicle.get("LicenseNo").getAsString()).append(", ")
                .append(WOVehicle.get("Make").getAsString()).append(" ")
                .append(WOVehicle.get("Model").getAsString()).append(" ")
                .append(WOVehicle.get("SubModel").getAsString()).append(" <br />");
            if (WOVehicle.has("HolderCustomer") && !WOVehicle.get("HolderCustomer").isJsonNull()) {
              HolderCustomer = WOVehicle.get("HolderCustomer").getAsJsonObject();
            }
          }

          WOCustomer = itemObj.get("WOCustomer").getAsJsonObject();

          if (HolderCustomer != null) {
            sb.append(HolderCustomer.get("LName").getAsString()).append(" ")
                .append(HolderCustomer.get("FName").getAsString()).append(", ")
                .append(HolderCustomer.get("Tel1").getAsString()).append(" ")
                .append(HolderCustomer.get("Email").getAsString()).append(" <br />");
          } else {
            sb.append(WOCustomer.get("LName").getAsString()).append(" ")
                .append(WOCustomer.get("FName").getAsString()).append(", ")
                .append(WOCustomer.get("Tel1").getAsString()).append(" ")
                .append(WOCustomer.get("Email").getAsString()).append(" <br />");
          }
          sb.append(jobTitle.replaceAll("\r\n", "<br />"));


          itemRtn = new JsonObject();
          itemRtn.addProperty("WorkOrderId", itemObj.get("WorkOrderId").getAsString());
          itemRtn.addProperty("ServiceDate", itemObj.get("ServiceDate").getAsString());
          itemRtn.addProperty("WorkOrderStatus", itemObj.get("WorkOrderStatus").getAsString());
          itemRtn.addProperty("WorkOrderNo", itemObj.get("WorkOrderNo").getAsString());
          itemRtn.addProperty("html", sb.toString());

          listRtn.add(itemRtn);
        }
        return new ResponseEntity<>(listRtn.toString(), HttpStatus.OK);
      } else {
        return new ResponseEntity<>(rtn, HttpStatus.OK);
      }
    } catch (Exception ex) {
      return parseException(ex);
    }
  }

  @PostMapping("/wo/detail")
  @ResponseBody
  public ResponseEntity detail(@RequestBody Map<String, String> params) {
    try {
      String rtn = wokOrderClient.detail(getToken(), getSiteId(), params);
      return new ResponseEntity<>(rtn, HttpStatus.OK);
    } catch (Exception ex) {
      return parseException(ex);
    }
  }

}
