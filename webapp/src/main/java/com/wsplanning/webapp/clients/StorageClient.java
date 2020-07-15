package com.wsplanning.webapp.clients;

import com.wsplanning.webapp.RestTemplateResponseErrorHandler;
import com.wsplanning.webapp.dto.WOAttachmentDTO;
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
import java.util.HashMap;

/**
 * Created by ThuyetLV
 */
@Component
public class StorageClient {
    private Logger logger = LoggerFactory.getLogger(StorageClient.class);
    private RestTemplate restTemplate;
    private String endpointUrl;

    @Autowired
    public StorageClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) {
        this.restTemplate = restTemplate;
        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        this.restTemplate.setErrorHandler(new RestTemplateResponseErrorHandler());
        this.endpointUrl = apiEndpointUrl + "/api/Storage";
    }

    //Download current vehicle condition picture:
    public String downloadVehicleAttachment(String token, String vehiId, String attachType) {

        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }

        String url = String.format("%s/ccar?VehiId=%s&AttachType=%s", this.endpointUrl, vehiId, attachType);
        logger.info("----------------downloadVehicleAttachment: " + url);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        return response.getBody();
    }

    //Take a photo of vehicle and upload it
    public String uploadVehicleAttachment(String token, String vehiId, WOAttachmentDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        if (StringUtils.isNotBlank(vehiId)) {
            headers.set("VehiId", vehiId);
        }
        headers.set("Content-Type", "application/json");
        HttpEntity<WOAttachmentDTO> entity = new HttpEntity<WOAttachmentDTO>(data, headers);
        String url = String.format("%s/ccar", this.endpointUrl);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        System.out.print(response.getBody());
        return response.getBody();
    }

    public String downloadCustAttachment(String token, String custId, String attachType) {
        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }

        String url = String.format("%s/cust?CustId=%s&AttachType=%s", this.endpointUrl, custId, attachType);
        logger.info("----------------downloadCustAttachment: " + url);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        if (HttpStatus.NO_CONTENT == response.getStatusCode()) {

        }
        return response.getBody();
    }

    public String uploadCustAttachment(String token, String custId, WOAttachmentDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        if (StringUtils.isNotBlank(custId)) {
            headers.set("CustId", custId);
        }
        headers.set("Content-Type", "application/json");
        HttpEntity<WOAttachmentDTO> entity = new HttpEntity<WOAttachmentDTO>(data, headers);
        String url = String.format("%s/cust", this.endpointUrl);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public String storageJob(String token, Integer workOrderNo, Integer jobNo, WOAttachmentDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        headers.set("WorkOrderNo", String.valueOf(workOrderNo));
        headers.set("JobNo", String.valueOf(jobNo));
        headers.set("Content-Type", "application/json");
        HttpEntity<WOAttachmentDTO> entity = new HttpEntity<WOAttachmentDTO>(data, headers);
        String url = String.format("%s/job", this.endpointUrl);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }
}
