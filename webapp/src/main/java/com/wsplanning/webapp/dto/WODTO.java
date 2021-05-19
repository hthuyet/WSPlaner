package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WODTO {

    public Integer WorkOrderNo;
    public Integer WorkOrderId; 
    public String ServiceDate;
    @JsonIgnore
    public String ExecutionDate;
    public String CheckInDate;
    public String CheckOutDate;
    @JsonIgnore
    public String BookMOTDate;
    @JsonIgnore
    public String BookTireDate;
    public String ServiceAdvisorId;
    public String DeliveredBy;
    public String TransactionType;
    public String DeptId;
    public String StampStatus;
    public String WorkReadyDate;
    public String WorkReadyForInvoiceDate;
    public String WorkReadyBy;
    public String SubStatus;

    public String ContactLName ;
    public String ContactFName ;
    public String ContactPhone ;
    public String ContactEmail ;
    public boolean IsCustomerWaiting;
    public Integer IsRework;
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
  
    public List<ExternalURLDTO> ExternalURL;

    public WOVehicleDTO WOVehicle;

    public WOCustomerDTO WOCustomer;
  
    public WOCustomerDTO WOContact;
   
    public List<WOAttachmentDTO> WOAttachments;
 
    public List<WOResourceDTO> BookedResources;
  
    public List<WOResourcePoolDTO> BookedResourcePools;
  
    public List<WOJobDTO> WOJobs;
    
    @JsonIgnore
    public TokenDTO Token;  
  
    public List<MasterDataDTO> WOAddInf; 
}