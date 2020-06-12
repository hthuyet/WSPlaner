package com.wsplanning.webapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class WOAttachmentDTO {
    public Integer FileId;
    public String FileName;
    public String FileDescription;
    public String AttachType;
    public String AttachTypeDescription;
    public String ImageData;

}