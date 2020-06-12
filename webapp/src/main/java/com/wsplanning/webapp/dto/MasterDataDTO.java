package com.wsplanning.webapp.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class MasterDataDTO {
    public String Id;
    public String Name;
    public List<MasterDataItemDTO> Items;
  

}