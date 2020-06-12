package com.wsplanning.webapp.dto;

import java.util.Date;

import org.apache.poi.hpsf.Decimal;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class TokenDTO {
    
    public String Token;
    public String LangId;
    public String Expired;
    public String DMSUserId;
    public String ProfileId;
    public String SiteId;
    public Integer ErrorCode;
    public String ErrorDesc;
    public EmployeeDTO EmployeeData;

  
}