package com.wsplanning.webapp.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class WOVehicleDTO {

    public Integer VehiId;
    public String LicenseNo;
    public String VIN;
    public String Make;
    public String Model;
    public String SubModel;
    
    public Integer Mileage;
    public String SearchKey;
    public String VehicleNote;

    public String WarrantyInfo;
    public String NextMOTDate;
    public String NextServiceDate;
    public String PreviousServiceDate;
    public String VHCLink;
    public WOCustomerDTO PayerCustomer;
    public WOCustomerDTO HolderCustomer;
    public WOCustomerDTO UserCustomer;
    @JsonIgnore
    public WODTO OpenWorkOrders;
    public List<DynamicDataDTO> DynamicDataFields;
    public List<MasterDataItemDTO> VehicleNotifications;

}