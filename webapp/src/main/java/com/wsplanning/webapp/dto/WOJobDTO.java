package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.List;

import org.apache.poi.hpsf.Decimal;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class WOJobDTO {
    
    public Integer RowId;
    public Integer JobNo;
    public String Note;
    public String Complaint;
    public Number EstimatedTime;
    public String SmanId;
    public String ChargeCategoryId;
    public String DeptId;
    public String JobType;
    public String JobCategory;
    public String Payer;
    public String MainGroupId;
    public String SubGroupId;
	public String DiagnosticInfo ;
    public String SolutionInfo;
    public String JobBarCode;
    public Boolean PostPoned;
    public List<ServiceItemDTO> Items;
    public List<WOAttachmentDTO> JobAttachments;
    public List<DynamicDataDTO> AdditionalData;

}

