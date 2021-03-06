package com.wsplanning.webapp.clients;

import com.wsplanning.webapp.dto.TaskDTO;
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
import java.util.Map;

/**
 * Created by ThuyetLV
 */
@Component
public class TaskClient {
    private Logger logger = LoggerFactory.getLogger(TaskClient.class);
    //http://automaster.alliedsoft.hu:9092/api/Task?SiteId=102&SmanId=DUONG&bIsOpen=true&bGetCountOnly=true
    private RestTemplate restTemplate;
    private String endpointUrl;

    @Autowired
    public TaskClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) {
        this.restTemplate = restTemplate;
        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        this.endpointUrl = apiEndpointUrl + "/api/Task";
    }

    public String getData(String siteId, String SmanId, String bIsOpen, String bGetCountOnly, Map<String, String> params) {

        String page = params.get("page");
        String limit = params.get("limit");
        String AssignToMe = params.get("AssignToMe");
        String AssignByMe = params.get("AssignByMe");

        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(limit)) {
            headers.set("PageCount", limit);
        }
        if (StringUtils.isNotBlank(page)) {
            headers.set("Page", page);
        }

        if (StringUtils.isNotBlank(AssignToMe) && "true".equalsIgnoreCase(AssignToMe)) {
            headers.set("AssignToMe", AssignToMe);
        }

        if (StringUtils.isNotBlank(AssignByMe) && "true".equalsIgnoreCase(AssignByMe)) {
            headers.set("AssignByMe", AssignByMe);
        }


        String url = "";
        if (bGetCountOnly != null && StringUtils.isNotBlank(bGetCountOnly)) {
            url = String.format("%s?SiteId=%s&SmanId=%s&bIsOpen=%s&bGetCountOnly=%s", this.endpointUrl, siteId, SmanId, bIsOpen, String.valueOf(bGetCountOnly));
        } else {
            url = String.format("%s?SiteId=%s&SmanId=%s&bIsOpen=%s", this.endpointUrl, siteId, SmanId, bIsOpen);
        }

        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
        return response.getBody();
    }

    public String saveTask(String token, String action, TaskDTO data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        if (StringUtils.isNotBlank(token)) {
            headers.set("Token", token);
        }
        if (StringUtils.isNotBlank(action)) {
            headers.set("PostAction", action);
        }
        // headers.set("Content-Type", "application/json");
        HttpEntity<TaskDTO> entity = new HttpEntity<TaskDTO>(data, headers);
        // logger.info("--------" + new Gson().toJson(data));
        String url = String.format("%s", this.endpointUrl);

        // List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        // interceptors.add(new LoggingRequestInterceptor());
        // restTemplate.setInterceptors(interceptors);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        System.out.print(response.getBody());
        // System.out.print(response);

        return response.getBody();
    }
}
