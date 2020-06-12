package com.wsplanning.webapp.dto;

import java.util.Date;
import org.apache.poi.hpsf.Decimal;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class WOResourcePoolDTO {
    public Integer RowId;
    public Number Duration;
    public String WorkDay;
    public String DeptId;
    public String ShiftId;

}