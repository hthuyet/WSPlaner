package com.wsplanning.webapp.controllers;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.gson.*;
import com.wsplanning.webapp.clients.ASMasterClient;
import com.wsplanning.webapp.clients.SearchServiceItemClient;
import com.wsplanning.webapp.clients.StampingClient;
import com.wsplanning.webapp.clients.WokOrderClient;
import com.wsplanning.webapp.dto.ExternalURLDTO;
import com.wsplanning.webapp.dto.WOCustomerDTO;
import com.wsplanning.webapp.dto.WODTO;
import com.wsplanning.webapp.dto.WOJobDTO;
import com.wsplanning.webapp.dto.WOVehicleDTO;
import com.wsplanning.webapp.dto.WOViewsDTO;
import com.wsplanning.webapp.utils.Utils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class WOController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(WOController.class);

    @Autowired
    protected WokOrderClient wokOrderClient;

    @Autowired
    protected StampingClient stampingClient;

    @Autowired
    protected ASMasterClient asMasterClient;

    @Autowired
    protected SearchServiceItemClient searchServiceItemClient;

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
            long startTime = System.currentTimeMillis();
            String rtn = wokOrderClient.getWO(getToken(), getSiteId(), params);
            logger.info("-------wokOrderClient getWO: " + (System.currentTimeMillis() - startTime));
            startTime = System.currentTimeMillis();
            if (rtn != null && StringUtils.isNotBlank(rtn)) {
                // JsonParser
                logger.info("-------wokOrderClient JsonParser: " + (System.currentTimeMillis() - startTime));
                startTime = System.currentTimeMillis();
                JsonParser parser = new JsonParser();
                JsonElement tradeElement = parser.parse(rtn);
                JsonArray listData = tradeElement.getAsJsonArray();
                logger.info("-------wokOrderClient end JsonParser: " + (System.currentTimeMillis() - startTime));
                startTime = System.currentTimeMillis();

                // Init list
                JsonArray listRtn = new JsonArray();
                JsonObject itemRtn = null;

                // Init variable
                JsonObject itemObj = null;
                JsonObject WOVehicle = null;
                JsonObject HolderCustomer = null;
                JsonObject WOCustomer = null;
                StringBuilder sb = new StringBuilder();
                String jobTitle = "";

                logger.info("-------wokOrderClient start for: " + (System.currentTimeMillis() - startTime));
                startTime = System.currentTimeMillis();
                for (JsonElement item : listData) {
                    HolderCustomer = null;
                    sb = new StringBuilder();
                    sb.setLength(0);

                    itemObj = item.getAsJsonObject();
                    jobTitle = itemObj.get("JobTitle").getAsString();
                    // jobTitle = itemObj.get("jobTitle").getAsString();

                    if (itemObj.has("WOVehicle") && !itemObj.get("WOVehicle").isJsonNull()) {
                        WOVehicle = itemObj.get("WOVehicle").getAsJsonObject();
                        sb.append(WOVehicle.get("LicenseNo").getAsString()).append(", ")
                                .append(WOVehicle.get("Make").getAsString()).append(" ")
                                .append(WOVehicle.get("Model").getAsString()).append(" ")
                                .append(WOVehicle.get("SubModel").getAsString()).append(", ")
                                .append(WOVehicle.get("VIN").getAsString()).append(" <br />");
                        if (WOVehicle.has("HolderCustomer") && !WOVehicle.get("HolderCustomer").isJsonNull()) {
                            HolderCustomer = WOVehicle.get("HolderCustomer").getAsJsonObject();
                        }
                    }

                    WOCustomer = itemObj.get("WOCustomer").getAsJsonObject();

                    if (HolderCustomer != null) {
                        sb.append(HolderCustomer.get("LName").getAsString()).append(" ")
                                .append(HolderCustomer.get("FName").getAsString()).append(", ").append("<a href=\"tel:")
                                .append(HolderCustomer.get("Tel1").getAsString()).append("\">")
                                .append(HolderCustomer.get("Tel1").getAsString()).append("</a> ")
                                .append("<a href=\"mailto:").append(HolderCustomer.get("Email").getAsString())
                                .append("?Subject=Hello%20again\">").append(HolderCustomer.get("Email").getAsString())
                                .append("</a>").append(" <br />");
                    } else {
                        sb.append(WOCustomer.get("LName").getAsString()).append(" ")
                                .append(WOCustomer.get("FName").getAsString()).append(", ").append("<a href=\"tel:")
                                .append(WOCustomer.get("Tel1").getAsString()).append("\">")
                                .append(WOCustomer.get("Tel1").getAsString()).append("</a> ")
                                .append("<a href=\"mailto:").append(WOCustomer.get("Email").getAsString())
                                .append("?Subject=Hello%20again\">").append(WOCustomer.get("Email").getAsString())
                                .append("</a>").append(" <br />");
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

                logger.info("-------wokOrderClient end for: " + (System.currentTimeMillis() - startTime));
                startTime = System.currentTimeMillis();

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


    @PostMapping("/wo/detail_mapping")
    @ResponseBody
    public ResponseEntity detail_mapping(@RequestBody Map<String, String> params) {
        try {
            String rtn = wokOrderClient.detail(getToken(), getSiteId(), params);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
            objectMapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            long startTime = System.currentTimeMillis();
            WODTO wodto = objectMapper.readValue(rtn, WODTO.class);
            
            
            if(rtn != null && StringUtils.isNotBlank(rtn)) {
                JsonParser parser = new JsonParser();
                JsonElement tradeElement = parser.parse(rtn);
                JsonObject itemObj = tradeElement.getAsJsonObject();
               
                if (itemObj.has("ExternalUrl") && !itemObj.get("ExternalUrl").isJsonNull()) {
                    for (JsonElement item : itemObj.get("ExternalUrl").getAsJsonArray()) {
                        ExternalURLDTO ExternalUrl = objectMapper.readValue(item.toString(), ExternalURLDTO.class);
                        // wodto.ExternalURL.add(ExternalUrl);
                    }
                }
                
                WOVehicleDTO Vehicle = objectMapper.readValue(itemObj.get("WOVehicle").toString(), WOVehicleDTO.class);
                WOCustomerDTO Customer = objectMapper.readValue(itemObj.get("WOCustomer").toString(), WOCustomerDTO.class);
                WOCustomerDTO Contact = objectMapper.readValue(itemObj.get("WOContact").toString(), WOCustomerDTO.class);
                // WODTO OpenWorkOrders = objectMapper.readValue(itemObj.get("OpenWorkOrders").toString(), WODTO.class);
                // WOCustomerDTO HolderCustomer = objectMapper.readValue(itemObj.get("HolderCustomer").toString(), WOCustomerDTO.class);
                // WOCustomerDTO PayerCustomer = objectMapper.readValue(itemObj.get("PayerCustomer").toString(), WOCustomerDTO.class);
                // WOCustomerDTO UserCustomer = objectMapper.readValue(itemObj.get("UserCustomer").toString(), WOCustomerDTO.class);
                if(itemObj.has("WOJobs") && !itemObj.get("WOJobs").isJsonNull() ) {
                    for (JsonElement item : itemObj.get("WOJobs").getAsJsonArray()) {
                        WOJobDTO Jobs = objectMapper.readValue(item.toString(), WOJobDTO.class);
                        wodto.WOJobs.add(Jobs);
                    }
                }

                wodto.WOVehicle = Vehicle;
                wodto.WOCustomer = Customer;
                wodto.WOContact = Contact;
             
            };
           
            logger.info("-------wokOrderClient getWO: " + (System.currentTimeMillis() - startTime));
            startTime = System.currentTimeMillis();
            return new ResponseEntity<>(wodto, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
        }
    }

    @PostMapping("/wo/getPhoto")
    @ResponseBody
    public ResponseEntity getPhoto(@RequestBody Map<String, String> params) {
        try {
            String rtn = wokOrderClient.getPhoto(getToken(), getSiteId(), params);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
        }
    }

    @GetMapping("/wo/jobTab")
    @ResponseBody
    public ResponseEntity jobTab(@RequestParam("CustNo") String CustNo, @RequestParam("VehiId") String VehiId) {
        try {
            String rtn = asMasterClient.jobTab(getSiteId(), CustNo, VehiId);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
            // TODO: handle exception
        }
    }

    @PostMapping("/wo/serviceItem")
    @ResponseBody
    public ResponseEntity serviceItem(@RequestBody Map<String, String> params) {
        try {
            long startTime = System.currentTimeMillis();
            String rtn = searchServiceItemClient.getServiceItem(getToken(), params);
            logger.info("-------wokOrderClient end for: " + (System.currentTimeMillis() - startTime));
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
            // TODO: handle exception
        }
    }

    @PostMapping("/wo/countServiceItem")
    @ResponseBody
    public ResponseEntity countServiceItem(@RequestBody Map<String, String> params) {
        try {
            String rtn = searchServiceItemClient.getCountServiceItem(getToken(), params);

            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
            // TODO: handle exception
        }
    }

    @GetMapping("/wo/getTextLine")
    @ResponseBody
    public ResponseEntity getTextLine() {
        try {
            String rtn = asMasterClient.getTextLine(getSiteId());
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
            // TODO: handle exception
        }
    }

    @PostMapping("/wo/workOrder")
    @ResponseBody
    public ResponseEntity workOrder(@RequestBody WODTO data) {
        try {
            String rtn = wokOrderClient.postWO(getToken(), "createNew", data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
        }
    }

    @PostMapping("/wo/workOrderTest")
    @ResponseBody
    public ResponseEntity workOrderTest(@RequestBody WODTO data,
            @RequestHeader(name = "postAction") String postAction) {
        try {
            data.SiteId = getSiteId();
            String rtn = wokOrderClient.postWO(getToken(), postAction, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
        }
    }

    // test mapping json object with pojo class
    @PostMapping("/wo/getWorkOrdersByView")
    @ResponseBody
    public ResponseEntity getWorkOrders(@RequestBody Map<String, String> params){
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
            objectMapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            long startTime = System.currentTimeMillis();
            String rtn = wokOrderClient.getWO(getToken(), getSiteId(), params);
            
            List<WOViewsDTO> listWO = new ArrayList<>();
            
            if(rtn != null && StringUtils.isNotBlank(rtn)) {
                JsonParser parser = new JsonParser();
                JsonElement tradeElement = parser.parse(rtn);
                JsonObject itemObj = null;
                JsonArray listData = tradeElement.getAsJsonArray();
                for (JsonElement item : listData) {
                    StringBuilder sb = new StringBuilder();
                    sb.setLength(0);
                    itemObj = item.getAsJsonObject();                  
                    WOViewsDTO woviews = objectMapper.readValue(itemObj.toString(), WOViewsDTO.class);
                    if (woviews.WOVehicle != null) {
                        sb.append(woviews.WOVehicle.LicenseNo).append(", ")
                                .append(woviews.WOVehicle.Make).append(" ")
                                .append(woviews.WOVehicle.Model).append(" ")
                                .append(woviews.WOVehicle.SubModel).append(", ")
                                .append(woviews.WOVehicle.VIN).append(" <br />");
                    }

                    if (woviews.WOVehicle.HolderCustomer != null) {
                        sb.append(woviews.WOVehicle.HolderCustomer.LName).append(" ")
                        .append(woviews.WOVehicle.HolderCustomer.FName).append(", ").append("<a href=\"tel:")
                        .append(woviews.WOVehicle.HolderCustomer.Tel1).append("\">")
                        .append(woviews.WOVehicle.HolderCustomer.Tel1).append("</a> ")
                        .append("<a href=\"mailto:").append(woviews.WOVehicle.HolderCustomer.Email)
                        .append("?Subject=Hello%20again\">").append(woviews.WOVehicle.HolderCustomer.Email)
                        .append("</a>").append(" <br />");
                    } else {
                        sb.append(woviews.WOCustomer.LName).append(" ")
                                .append(woviews.WOCustomer.FName).append(", ").append("<a href=\"tel:")
                                .append(woviews.WOCustomer.Tel1).append("\">")
                                .append(woviews.WOCustomer.Tel1).append("</a> ")
                                .append("<a href=\"mailto:").append(woviews.WOCustomer.Email)
                                .append("?Subject=Hello%20again\">").append(woviews.WOCustomer.Email)
                                .append("</a>").append(" <br />");
                    }
                    sb.append(woviews.JobTitle.replaceAll("\r\n", "<br />"));
                    woviews.html = sb.toString();
                    listWO.add(woviews);
                }
            };
           
            logger.info("-------wokOrderClient getWO: " + (System.currentTimeMillis() - startTime));
            startTime = System.currentTimeMillis();
            return new ResponseEntity<>(listWO, HttpStatus.OK);
        } catch (Exception e) {
            //TODO: handle exception
            return parseException(e);
        }
    }


    // FOR TEST
    private WODTO testData() {
        // init
        WOVehicleDTO WOVehicle = new WOVehicleDTO();
        WOVehicle.VehiId = 306422;
        WOCustomerDTO WOCustomer = new WOCustomerDTO();
        WOCustomer.CustNo = 116206;
        WOCustomerDTO WOContact = new WOCustomerDTO();
        WOContact.CustNo = 116206;

        List<WOJobDTO> WOJobs = new ArrayList<>();
        WOJobDTO job = new WOJobDTO();
        // job.ChargeCategoryId = 10;
        job.JobType = "1";
        job.JobCategory = "BODY";
        job.DeptId = "A4";
        job.Payer = "DC_ISP";
        WOJobs.add(job);

        // WODTO
        WODTO objWO = new WODTO();
        objWO.SiteId = "102";
        objWO.DeptId = "A4";
        objWO.WOVehicle = WOVehicle;
        objWO.WOCustomer = WOCustomer;
        objWO.WOContact = WOContact;
        objWO.Mileage = 0;
        // objWO.ServiceDate = new Date();
        objWO.IsTimeReservation = 1;
        objWO.VisitReasonCode = "01";
        objWO.JobTitle = "Annual service";
        objWO.CustomerComplaint = "30 tkm service";
        objWO.WOJobs = WOJobs;

        Gson gson = new Gson();
        logger.info("--------" + gson.toJson(objWO));
        return objWO;
    }

    @GetMapping("/wo/test")
    public String test(Model model) {
        try {
            WODTO data = testData();
            String rtn = wokOrderClient.postWO(getToken(), "createNew", data);
            logger.info("----------postWO: " + rtn);
        } catch (Exception ex) {
            logger.error("ERROR test: ", ex);
        }
        return "wo/index";
    }


    @GetMapping("/wo/encode")
    public String encode(Model model) {
        try {
            String rtn = Utils.encodeFileToBase64Binary("E:\\3731152_passat-12.jpg");
            logger.info("----------encode: " + rtn);
        } catch (Exception ex) {
            logger.error("ERROR encode: ", ex);
        }
        return "wo/index";
    }

    @PostMapping("/wo/confirm")
    public ResponseEntity confirm(@RequestBody Map<String, String> params) {
        try {
            String rtn = stampingClient.confirmStamping(getToken(), params);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception e) {
            return parseException(e);
            // TODO: handle exception
        }
    }

    @PostMapping("/wo/getGridWO")
    @ResponseBody
    public ResponseEntity getGridWO(@RequestBody Map<String, String> params) {
        try {
            String rtn = wokOrderClient.getGridWO(getToken(), getSiteId(), params);

            if (rtn != null && StringUtils.isNotBlank(rtn)) {
                // JsonParser
                JsonParser parser = new JsonParser();
                JsonElement tradeElement = parser.parse(rtn);
                JsonArray listData = tradeElement.getAsJsonArray();

                // Init list
                JsonArray listRtn = new JsonArray();
                JsonObject itemRtn = null;

                // Init variable
                JsonObject itemObj = null;
                JsonObject WOVehicle = null;
                JsonObject WOCustomer = null;

                for (JsonElement item : listData) {
                    itemObj = item.getAsJsonObject();

                    itemRtn = new JsonObject();
                    itemRtn.addProperty("WorkOrderStatus", itemObj.get("WorkOrderStatus").getAsString());
                    itemRtn.addProperty("WorkOrderId", itemObj.get("WorkOrderId").getAsString());
                    itemRtn.addProperty("VisitReasonCode", itemObj.get("VisitReasonCode").getAsString());
                    // if(itemObj.has("Description") && !itemObj.get("Description").isJsonNull()) {
                    //     itemRtn.addProperty("VisitReason", itemObj.get("VisitReasonCode").getAsString() + "="
                    //     + itemObj.get("Description").getAsString());
                    // }
                    // itemRtn.addProperty("Description", itemObj.get("VisitReasonCode").getAsString());
                  
                    if (itemObj.has("SubStatus") && !itemObj.get("SubStatus").isJsonNull()) {
                        itemRtn.addProperty("SubStatus", itemObj.get("SubStatus").getAsString());
                    }
                    if (itemObj.has("PlaceOfDamage") && !itemObj.get("PlaceOfDamage").isJsonNull()) {
                        itemRtn.addProperty("PlaceOfDamage", itemObj.get("PlaceOfDamage").getAsString());
                    }
                    if (itemObj.has("WorkReadyForInvoiceDate")
                            && !itemObj.get("WorkReadyForInvoiceDate").isJsonNull()) {
                        itemRtn.addProperty("WorkReadyForInvoiceDate",
                                itemObj.get("WorkReadyForInvoiceDate").getAsString());
                    }
                    itemRtn.addProperty("DeptId", itemObj.get("DeptId").getAsString());
                    // itemRtn.addProperty("Department", itemObj.get("DeptId").getAsString() + "=" + itemObj.get("Description").getAsString());
                    itemRtn.addProperty("PayerInfo", itemObj.get("PayerInfo").getAsString());
                    itemRtn.addProperty("ContactFName", itemObj.get("ContactFName").getAsString());
                    itemRtn.addProperty("ContactLName", itemObj.get("ContactLName").getAsString());
                    itemRtn.addProperty("CourtesyCarInfo", itemObj.get("CourtesyCarInfo").getAsString());
                    itemRtn.addProperty("TransactionType", itemObj.get("TransactionType").getAsString());
                    itemRtn.addProperty("WorkOrderNo", itemObj.get("WorkOrderNo").getAsString());
                    itemRtn.addProperty("EstimatedTimeTot", itemObj.get("EstimatedTimeTot").getAsString());
                    itemRtn.addProperty("PoolTimeTot", itemObj.get("PoolTimeTot").getAsString());
                    itemRtn.addProperty("BookedTimeTot", itemObj.get("BookedTimeTot").getAsString());
                    itemRtn.addProperty("ServiceAdvisorId", itemObj.get("ServiceAdvisorId").getAsString());
                    itemRtn.addProperty("ServiceDate", itemObj.get("ServiceDate").getAsString());
                    itemRtn.addProperty("SubContractorInfo", itemObj.get("SubContractorInfo").getAsString());
                    itemRtn.addProperty("Mileage", itemObj.get("Mileage").getAsString());
                    itemRtn.addProperty("Reference", itemObj.get("Reference").getAsString());
                    itemRtn.addProperty("WorkOrderNote", itemObj.get("WorkOrderNote").getAsString());
                    itemRtn.addProperty("CheckOutDate", itemObj.get("CheckOutDate").getAsString());
                    itemRtn.addProperty("DeliveredBy", itemObj.get("DeliveredBy").getAsString());
                    // itemRtn.addProperty("WorkReadyDate",
                    // itemObj.get("WorkReadyDate").getAsString());
                    itemRtn.addProperty("WorkReadyBy", itemObj.get("WorkReadyBy").getAsString());
                    itemRtn.addProperty("AttachmentFilesCount", itemObj.get("AttachmentFilesCount").getAsString());

                    if (itemObj.has("WOVehicle") && !itemObj.get("WOVehicle").isJsonNull()) {
                        WOVehicle = itemObj.get("WOVehicle").getAsJsonObject();
                        itemRtn.addProperty("LicenseNo", WOVehicle.get("LicenseNo").getAsString());
                        itemRtn.addProperty("SearchKey", WOVehicle.get("SearchKey").getAsString());
                        itemRtn.addProperty("VIN", WOVehicle.get("VIN").getAsString());
                        itemRtn.addProperty("FirstRegDate", WOVehicle.get("FirstRegDate").getAsString());
                        itemRtn.addProperty("NextServiceDate", WOVehicle.get("NextServiceDate").getAsString());
                        itemRtn.addProperty("NextMOTDate", WOVehicle.get("NextMOTDate").getAsString());
                        itemRtn.addProperty("PreviousServiceDate", WOVehicle.get("PreviousServiceDate").getAsString());
                        itemRtn.addProperty("Make", WOVehicle.get("Make").getAsString());
                        itemRtn.addProperty("Model", WOVehicle.get("Model").getAsString());
                        itemRtn.addProperty("SubModel", WOVehicle.get("SubModel").getAsString());
                        itemRtn.addProperty("VehicleNote", WOVehicle.get("VehicleNote").getAsString());
                    }

                    if (itemObj.has("WOCustomer") && !itemObj.get("WOCustomer").isJsonNull()) {
                        WOCustomer = itemObj.get("WOCustomer").getAsJsonObject();
                        itemRtn.addProperty("CustNo", WOCustomer.get("CustNo").getAsString());
                        if (WOCustomer.has("FName") && !WOCustomer.get("FName").isJsonNull()) {
                            itemRtn.addProperty("FName", WOCustomer.get("FName").getAsString());
                        }
                        if (WOCustomer.has("LName") && !WOCustomer.get("LName").isJsonNull()) {
                            itemRtn.addProperty("LName", WOCustomer.get("LName").getAsString());
                        }
                    }

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
}
