package org.traceo.common.transport.query;

import lombok.Setter;
import org.traceo.common.transport.enums.OrderEnum;

import java.io.Serializable;

@Setter
public class BaseDtoQuery implements Serializable {
    private String projectId;
    private OrderEnum order = OrderEnum.DESC;
    private Integer page = 1;
    private Integer take = 50;
    private String search;
    private String sortBy;
}
