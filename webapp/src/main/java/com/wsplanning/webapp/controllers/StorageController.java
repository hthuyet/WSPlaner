package com.wsplanning.webapp.controllers;

import com.wsplanning.webapp.clients.StorageClient;
import com.wsplanning.webapp.dto.WOAttachmentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class StorageController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(CourtesyCarController.class);

    @Autowired
    protected StorageClient client;

    @Autowired
    protected HttpSession session;

    @Autowired
    HttpSession httpSession;

    @GetMapping("/storage/downloadVehicleAttachment/{vehiId}/{attachType}")
    @ResponseBody
    public ResponseEntity downloadVehicleAttachment(@PathVariable("vehiId") String vehiId,
                                                    @PathVariable("attachType") String attachType) {
        try {
            String token = getToken();
            String rtn = client.downloadVehicleAttachment(token, vehiId, attachType);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @PostMapping("/storage/uploadVehicleAttachment/{vehiId}")
    @ResponseBody
    public ResponseEntity uploadVehicleAttachment(@PathVariable("vehiId") String vehiId,
                                                  @RequestBody WOAttachmentDTO data) {
        try {
            String token = getToken();
            String rtn = client.uploadVehicleAttachment(token, vehiId, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @GetMapping("/storage/downloadCustAttachment/{custId}/{attachType}")
    @ResponseBody
    public ResponseEntity downloadCustAttachment(@PathVariable("custId") String custId,
                                                 @PathVariable("attachType") String attachType) {
        try {
            String token = getToken();
            String rtn = client.downloadCustAttachment(token, custId, attachType);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @PostMapping("/storage/uploadCustAttachment/{custId}")
    @ResponseBody
    public ResponseEntity uploadCustAttachment(@PathVariable("custId") String custId,
                                               @RequestBody WOAttachmentDTO data) {
        try {
            String token = getToken();
            String rtn = client.uploadCustAttachment(token, custId, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }
}
