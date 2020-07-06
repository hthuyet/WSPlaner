package com.wsplanning.webapp.clients;

import com.wsplanning.webapp.dto.CourtesyCarResDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.time.LocalDate;
import java.util.HashMap;

import static com.wsplanning.webapp.utils.Utils.formateDateAPI;

/**
 * Created by ThuyetLV
 */
@Component
public class CourtesyCarClient {
    private Logger logger = LoggerFactory.getLogger(CourtesyCarClient.class);
    private RestTemplate restTemplate;
    private String endpointUrl;

    @Autowired
    public CourtesyCarClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) {
        this.restTemplate = restTemplate;
        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        this.endpointUrl = apiEndpointUrl + "/api/CourtesyCar";
    }

    public String getCCResByVehicle(String token, Integer vehiGroup) {

        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }

        if (vehiGroup != null && vehiGroup > 0){
            headers.set("Group", String.valueOf(vehiGroup));
        }

        String url = String.format("%s", this.endpointUrl);
        logger.info("----------------getCCResByVehicle: " + url);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        return response.getBody();
    }

    public String getCCResByVehicle(String token, String vehiId, String dtFrom, String dtTo) {

        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }

        if (StringUtils.isNotBlank(dtFrom)) {
            headers.set("DateFrom", dtFrom);
        }

        if (StringUtils.isNotBlank(dtTo)) {
            headers.set("DateTo", dtTo);
        }

        String url = String.format("%s/%s", this.endpointUrl, vehiId);
        logger.info("----------------getCCResByVehicle: " + url);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        return response.getBody();
    }

    public String getCCResByWO(String token, String siteId, String nWorkOrderId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        String url = String.format("%s/wo?SiteId=%s&WorkOrderId=%s", this.endpointUrl,siteId, nWorkOrderId);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        logger.info(response.getBody());
        return response.getBody();
    }

    public Boolean saveCCRes(String token, CourtesyCarResDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        headers.set("PostAction", "insert");
        HttpEntity<CourtesyCarResDTO> entity = new HttpEntity<CourtesyCarResDTO>(data, headers);
        String url = String.format("%s", this.endpointUrl);
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.POST, entity, Boolean.class);
        logger.info("----saveCCRes: " + response.getBody());
        return response.getBody();
    }

    public Boolean checkinCCRes(String token, CourtesyCarResDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        headers.set("PostAction", "return");
        data.CheckInTime = formateDateAPI(LocalDate.now());
        HttpEntity<CourtesyCarResDTO> entity = new HttpEntity<CourtesyCarResDTO>(data, headers);
        String url = String.format("%s", this.endpointUrl);
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.POST, entity, Boolean.class);
        logger.info("----checkinCCRes: " + response.getBody());
        return response.getBody();
    }

    public Boolean checkoutCCRes(String token, CourtesyCarResDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        headers.set("PostAction", "deliver");
        data.CheckOutTime = formateDateAPI(LocalDate.now());
        HttpEntity<CourtesyCarResDTO> entity = new HttpEntity<CourtesyCarResDTO>(data, headers);
        String url = String.format("%s", this.endpointUrl);
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.POST, entity, Boolean.class);
        logger.info("----checkoutCCRes: " + response.getBody());
        return response.getBody();
    }

}
