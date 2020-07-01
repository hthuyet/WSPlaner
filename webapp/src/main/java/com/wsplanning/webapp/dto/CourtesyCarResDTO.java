package com.wsplanning.webapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourtesyCarResDTO {
    public int Id;
    public WOVehicleDTO ResVehicle;
    public String ChargeId;
    public String ReservationFrom;
    public String ReservationTo;
    public String CheckOutTime;
    public String CheckInTime;
    public Boolean isDelivered;
    public Boolean isReturned;
    public int DeliveryMileage;
    public int ReturnMileage;
    public String DeliveryFuelId;
    public String ReturnFuelId;
    public String DeliveryNote;
    public String ReturnNote;
    public int WorkOrderId;
    public int WorkOrderNo;
    public WOCustomerDTO ResCustomer;
    public String SiteId;
    public String VehicleInfo;
}
