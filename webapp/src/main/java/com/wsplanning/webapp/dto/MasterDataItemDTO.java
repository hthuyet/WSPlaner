package com.wsplanning.webapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
// add object to mapping json object from Mr.Duong
public class MasterDataItemDTO {
    public String Id;
    public String Value;
    public String NValue;
}