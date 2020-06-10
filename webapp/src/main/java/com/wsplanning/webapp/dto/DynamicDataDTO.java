package com.wsplanning.webapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DynamicDataDTO {
    public String Id;
    // add column -  update from Mr.Duong
    // public Boolean TechUseOnly;
    // public String DataType;
    //
    public String Category;
    public String Label;
    // public String DeptId;
    public Boolean Editable;
    public String Value;
    public String DBield;
  

}