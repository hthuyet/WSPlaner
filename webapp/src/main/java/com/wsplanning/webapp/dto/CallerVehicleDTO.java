package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CallerVehicleDTO {

    public String LicenseNo;
    public String Make; 
    public String NextMOTDate;
    public String WarrantyInfo;
  
}