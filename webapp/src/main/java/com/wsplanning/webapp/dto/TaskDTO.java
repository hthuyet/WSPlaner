package com.wsplanning.webapp.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskDTO {
    public String Id;
    public String SiteId ;
    public String SmanId;
    public String SmanName;
    public String CreatedBy;
    public String CreatedByName;
    public String Started ;
    public String TaskSeriesFlag ;
    public String TaskType ;
    public String TaskTypeDescription ;
    public String WorkOrderNo ;
    public String Ended;
    public Boolean isOpen ;
    public String Body;
    public String Header;
    public String action;
    public WOCustomerDTO TaskCustomer;
    public List<CallerVehicleDTO> CallerVehicles;
}
