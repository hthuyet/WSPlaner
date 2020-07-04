package com.wsplanning.webapp.controllers;

import com.wsplanning.webapp.clients.CourtesyCarClient;
import com.wsplanning.webapp.dto.CourtesyCarResDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;

import static com.wsplanning.webapp.utils.Utils.formateDateAPI;

@Controller
public class CourtesyCarController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(StorageController.class);

    @Autowired
    protected CourtesyCarClient client;

    @Autowired
    protected HttpSession session;

    @Autowired
    HttpSession httpSession;

    @GetMapping("/courtesyCar/getCCResByVehicle")
    @ResponseBody
    public ResponseEntity getCCResByVehicle(@RequestParam(name = "group", required = false) Integer group) {
        try {
            String token = getToken();
            String rtn = client.getCCResByVehicle(token, group);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @GetMapping("/courtesyCar/getCCResByVehicle/{vehiId}")
    @ResponseBody
    public ResponseEntity getCCResByVehicle(@PathVariable("vehiId") String vehiId) {
        try {
            LocalDate now = LocalDate.now();
            LocalDate to = LocalDate.now();
            to = to.plusMonths(1);

            String token = getToken();
            String rtn = client.getCCResByVehicle(token, vehiId, formateDateAPI(now), formateDateAPI(to));
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @GetMapping("/courtesyCar/getCCResByWO/{wo}")
    @ResponseBody
    public ResponseEntity getCCResByWO(@PathVariable(name = "wo") String wo) {
        try {
            String token = getToken();
            String rtn = client.getCCResByWO(token, getSiteId(), wo);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @PostMapping("/courtesyCar/save")
    @ResponseBody
    public ResponseEntity saveCCRes(@RequestBody CourtesyCarResDTO data) {
        try {
            String token = getToken();
            Boolean rtn = client.saveCCRes(token, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @PostMapping("/courtesyCar/checkinCCRes")
    @ResponseBody
    public ResponseEntity checkinCCRes(@RequestBody CourtesyCarResDTO data) {
        try {
            String token = getToken();
            Boolean rtn = client.checkinCCRes(token, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

    @PostMapping("/courtesyCar/checkoutCCRes")
    @ResponseBody
    public ResponseEntity checkoutCCRes(@RequestBody CourtesyCarResDTO data) {
        try {
            String token = getToken();
            Boolean rtn = client.checkoutCCRes(token, data);
            return new ResponseEntity<>(rtn, HttpStatus.OK);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
            return parseException(ex);
        }
    }

}
