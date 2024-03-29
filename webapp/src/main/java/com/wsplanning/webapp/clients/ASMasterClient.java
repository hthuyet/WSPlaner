package com.wsplanning.webapp.clients;

import com.wsplanning.webapp.dto.CommandDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

/**
 * Created by ThuyetLV
 */
@Component
public class ASMasterClient {

    private Logger logger = LoggerFactory.getLogger(ASMasterClient.class);

    private RestTemplate restTemplate;
    private String endpointUrl;
    private String url;
    private static HashMap<String, String> hsmSite;

    @Autowired
    public ASMasterClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {

        TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;

        SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();

        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);

        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(csf)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory =
                new HttpComponentsClientHttpRequestFactory();

        requestFactory.setHttpClient(httpClient);

        this.restTemplate = restTemplate;

        this.restTemplate.setRequestFactory(requestFactory);

        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        this.endpointUrl = apiEndpointUrl + "/api/ASMaster";
        this.url = apiEndpointUrl + "/api/";
        hsmSite = new HashMap<>();
    }

    public String getSiteName(String Id) {
        if (hsmSite == null || hsmSite.isEmpty()) {
            getSites();
        }
        return hsmSite.get(Id);
    }

    public String getSites() {
        String url = String.format("%s?command=getSites", this.endpointUrl);
        String response = restTemplate.getForObject(url, String.class);
        if (hsmSite == null || hsmSite.isEmpty()) {
            if (hsmSite == null) {
                hsmSite = new HashMap<>();
            }
            JSONArray jsonArray = new JSONArray(response);
            JSONObject itemObj = null;
            for (int i = 0; i < jsonArray.length(); i++) {
                itemObj = jsonArray.getJSONObject(i);
                hsmSite.put(itemObj.getString("Id"), itemObj.getString("Name"));
            }
        }
        return response;
    }

    public String getLanguages() {
        String url = String.format("%s?command=getLanguages", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    // getTransactionTypes&amp;param1=[site_id]

    public String getTransactionTypes(String siteId) {
        String url = String.format("%s?command=getTransactionTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getDepartments(String siteId) {
        String url = String.format("%s?command=getDepartments&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getJobTypes(String siteId) {
        String url = String.format("%s?command=getJobTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getJobCats(String siteId) {
        String url = String.format("%s?command=getJobCats&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getPayers(String siteId) {
        String url = String.format("%s?command=getPayers&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getShifts(String siteId) {
        String url = String.format("%s?command=getShifts&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getVisitReasons(String siteId) {
        String url = String.format("%s?command=getVisitReasons&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getChargeCats(String siteId) {
        String url = String.format("%s?command=getChargeCats&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String jobTab(String SiteId, String CustNo, String VehicleId) {
        String url = String.format("%s/job?SiteId=%s&CustNo=%s&VehiId=%s", this.endpointUrl, SiteId, CustNo, VehicleId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getStampingCode(String param) {
        String url = String.format("%s?command=getStampingCodes&param1=%s", this.endpointUrl, param);
        return restTemplate.getForObject(url, String.class);
    }

    public String getTextLine(String SiteId) {
        String CustNo = "1";
        String VehiId = "1";
        String GetText = "true";
        String url = String.format("%s/text?SiteId=%s&CustNo=%s&VehiId=%s&bGetText=%s", this.endpointUrl, SiteId, CustNo,
                VehiId, GetText);
        return restTemplate.getForObject(url, String.class);
    }

    public String getTextPredict(Map<String, String> params) {
        String VIN = params.get("VIN");
        String language = params.get("language");
        String skey = params.get("skey");
        String url = String.format("%sTextPredict?VIN=%s&langId=%s&skey=%s", this.url, VIN, language, skey);
        return restTemplate.getForObject(url, String.class);
    }

    public JSONObject loadProperty() {
        String path = "messages/config.properties";
        String path_Menu = "messages/messages.properties";
        InputStream input = getClass().getClassLoader().getResourceAsStream(path);
        InputStream input_Menu = getClass().getClassLoader().getResourceAsStream(path_Menu);
        Properties prop_Auth = new Properties();
        Properties prop_Menu = new Properties();
        JSONArray jsonArray = new JSONArray();
        JSONArray jarray = new JSONArray();
        JSONArray arrIconBtnCommon = new JSONArray();
        JSONArray arrIconBtnDetail = new JSONArray();
        JSONArray arrayTab = new JSONArray();
        JSONArray arrTime = new JSONArray();
        JSONArray arrBtnCommon = new JSONArray();
        JSONArray arrBtnDetail = new JSONArray();
        // JSONArray properties = new JSONArray();
        JSONObject obj = new JSONObject();
        // Properties apikey = new Properties();

        //ThuyetLV
        JSONArray objJobHeader = new JSONArray();
        if (input == null) {
            System.out.println("not found");
            JSONObject jsonItem = new JSONObject();
            jsonItem.put("name", "free");
            jsonItem.put("value", "white");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "booked");
            jsonItem.put("value", "gray");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "cap50");
            jsonItem.put("value", "#f2f4f4");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "cap25");
            jsonItem.put("value", "#808b96");
            objJobHeader.put(jsonItem);

            obj.put("jobHeader", objJobHeader);
        } else {
            try {
                prop_Auth.load(input);
                prop_Menu.load(input_Menu);

                prop_Menu.forEach((k, v) -> {
                    String[] icoStrings = k.toString().split("\\.");

                    if (icoStrings[0].contains("icon")) {
                        JSONObject jmenu = new JSONObject();
                        jmenu.put("name", icoStrings[1]);
                        jmenu.put("class", v.toString());
                        jarray.put(jmenu);
                    }

                    if (icoStrings[0].contains("iconBtn")) {
                        JSONObject jmenu = new JSONObject();
                        if (icoStrings[1].contains("common")) {
                            jmenu.put("name", icoStrings[2]);
                            jmenu.put("class", v.toString());
                            arrIconBtnCommon.put(jmenu);
                        } else {
                            jmenu.put("name", icoStrings[2]);
                            jmenu.put("class", v.toString());
                            arrIconBtnDetail.put(jmenu);
                        }
                    }

                });

                JSONObject objTimeout = new JSONObject();
                JSONObject objBarcode = new JSONObject();
                JSONObject iconSize = new JSONObject();


                prop_Auth.forEach((key, value) -> {
                    JSONObject jsonItem = new JSONObject();
                    String strKey = key.toString();
                    if (StringUtils.isNotBlank(strKey)) {
                        String[] subStr = strKey.split("\\.");
                        if (StringUtils.startsWith(subStr[0],"app")) {
                            jsonItem.put("route", subStr[0] + "." + subStr[1] + "." + subStr[2]);
                            jsonItem.put("value", value.toString());
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonArray.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"tab")) {
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("value", value.toString());
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            arrayTab.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"timeout")) {
                            objTimeout.put("name", subStr[0]);
                            objTimeout.put("value", value.toString());
                        }else if (StringUtils.startsWith(subStr[0],"common")) {
                            jsonItem.put("text", subStr[1]);
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonItem.put("value", value.toString());
                            arrBtnCommon.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"detail")) {
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonItem.put("value", value.toString());
                            arrBtnDetail.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"barcode")) {
                            objBarcode.put("name", subStr[0]);
                            objBarcode.put("value", value.toString());
                        }else if (StringUtils.startsWith(subStr[0],"jobHeader")) {
                            jsonItem.put("name", subStr[1]);
                            jsonItem.put("value", value.toString());
                            objJobHeader.put(jsonItem);
                        } else if (StringUtils.startsWith(subStr[0],"icon")) {
                            iconSize.put("name", subStr[0] + "_" + subStr[1]);
                            iconSize.put("value", value.toString());
                        }

                    }
                    // arrTime.put(objTimeout);
                });

                obj.put("auth", jsonArray);
                obj.put("menu", jarray);
                obj.put("tab", arrayTab);
                obj.put("timeout", objTimeout);
                obj.put("common", arrBtnCommon);
                obj.put("detail", arrBtnDetail);
                obj.put("iconCommon", arrIconBtnCommon);
                obj.put("iconDetail", arrIconBtnDetail);
                obj.put("barcode", objBarcode);
                obj.put("jobHeader", objJobHeader);
                obj.put("iconSize", iconSize);

            } catch (IOException e) {
                // TODO Auto-generated catch block
                logger.error(e.getMessage(), e);
            }
        }
        return obj;
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterDB
    public String getCallCenterDB() {
        String url = String.format("%s?command=getCallCenterDB", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterSites&param1=AMSOPRON
    public String getCallCenterSites(String db) {
        String url = String.format("%s?command=getCallCenterSites&param1=%s", this.endpointUrl, db);
        return restTemplate.getForObject(url, String.class);
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterTaskType
    public String getCallCenterTaskType() {
        String url = String.format("%s?command=getCallCenterTaskType", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getTaskTypes&param1=102
    public String getTaskTypes(String siteId) {
        String url = String.format("%s?command=getTaskTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getTaskSeries&param1=102
    public String getTaskSeries(String siteId) {
        String url = String.format("%s?command=getTaskSeries&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getSuppliers
    public String getSuppliers() {
        String url = String.format("%s?command=getSuppliers", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getVHCTemplates&param1=102&param2=3222
    public String getVHCTemplates(String siteId, String vehiId) {
        String url = String.format("%s?command=getVHCTemplates&param1=%s&param2=%s", this.endpointUrl, siteId, vehiId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getWOSort&param1=102
    public String getWOSort(String siteId) {
        String url = String.format("%s?command=getWOSort&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getWorkOrderStatuses(String siteId) {
        String url = String.format("%s?command=getWorkOrderStatuses&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getSubStatuses(String siteId) {
        String url = String.format("%s?command=getSubStatuses&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getByCommand(String token, String siteId, String command) {
        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        if (StringUtils.isNotBlank(siteId)) {
            headers.set("SiteId", siteId);
        }
        String url = String.format("%s?command=%s", this.endpointUrl, command);

        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());

        return response.getBody();
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster/getCourtesyCarGroups
    public String getCourtesyCarGroups() {
        String url = String.format("%s/getCourtesyCarGroups", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    public String getCourtesyCarAPI() {
        String url = String.format("%s/CourtesyCarAPI", this.url);
        return restTemplate.getForObject(url, String.class);
    }

    @Async
    public CompletableFuture<CommandDTO> getByCommandAsync(String token, String siteId, String command) {
        long startTime = System.currentTimeMillis();
        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        if (StringUtils.isNotBlank(siteId)) {
            headers.set("SiteId", siteId);
        }
        String url = String.format("%s?command=%s", this.endpointUrl, command);

        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class, new HashMap<>());
        CommandDTO commandDTO = new CommandDTO();
        commandDTO.key = command;
        commandDTO.data = response.getBody();
        logger.info("-----------------Time to getByCommandAsync {" + command + "}: " + (System.currentTimeMillis() - startTime) + " ms");
        return CompletableFuture.completedFuture(commandDTO);
    }

}
