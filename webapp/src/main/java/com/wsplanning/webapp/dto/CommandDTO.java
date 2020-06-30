package com.wsplanning.webapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommandDTO {
    public String key;
    public List data;

    public String getKey() {
        return key;
    }

    public List getData() {
        return data;
    }
}
