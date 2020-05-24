package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class WODTO {

    public Integer WorkOrderNo;
    public Integer WorkOrderId; 
    public String ServiceDate;
    public String ExecutionDate;
    public String CheckInDate;
    public String CheckOutDate;
    public String BookMOTDate;
    public String BookTireDate;
    public String ServiceAdvisorId;
    public String DeliveredBy;
    public String TransactionType;
    public String DeptId;
    public String StampStatus;
    public String WorkReadyDate;
    public String WorkReadyForInvoiceDate;
    public String ContactLName ;
    public String ContactFName ;
    public String ContactPhone ;
    public String ContactEmail ;
    public Integer IsCustomerWaiting;
    public String TimeBarText;
    public String SiteId;
    public Integer IsTimeReservation;
    public Integer Mileage;
    public Integer StampId;
    public String VisitReasonCode;
    public Integer BookingId;
    public String JobTitle;
    public String CustomerComplaint;
    public Integer IsPickupService;
    public String PickupSmanId;
    public String PickupNote;
    public Integer IsReturnService;
    public String ReturnSmanId;
    public String ReturnNote;
    public String WorkOrderStatus;
    public String Vehicle;
    public String SubContractorInfo;
    public String PayerInfo;
    public String CourtesyCarInfo;
    public String WorkOrderNote;
    public String Reference;
    public Integer EstimatedTimeTot;
    public Integer PoolTimeTot;
    public Integer BookedTimeTot;
    public Integer AttachmentFilesCount;
    @JsonIgnore
    public List<ExternalURLDTO> ExternalURL;
    @JsonIgnore
    public WOVehicleDTO WOVehicle;
    @JsonIgnore
    public WOCustomerDTO WOCustomer;
    @JsonIgnore
    public WOCustomerDTO WOContact;
    @JsonIgnore
    public List<WOAttachmentDTO> WOAttachments;
    @JsonIgnore
    public List<WOResourceDTO> BookedResources;
    @JsonIgnore
    public List<WOResourcePoolDTO> BookedResourcePools;
    @JsonIgnore
    public List<WOJobDTO> WOJobs;
    
    public TokenDTO Token;  
    @JsonIgnore
    public List<MasterDataDTO> WOAddInf; 
}