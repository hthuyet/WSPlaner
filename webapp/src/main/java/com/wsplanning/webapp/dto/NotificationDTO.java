package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class NotificationDTO {

    public Integer Id;
    public String SmanId;
    public String SmanName;
    public String CreatedBy;
    public String Note;
    public String SiteId;
    public String IsNotified;
    public String Created;
    public String NotifiedTime;
    public String WorkOrderId;
    public String WorkOrderRowId;

}