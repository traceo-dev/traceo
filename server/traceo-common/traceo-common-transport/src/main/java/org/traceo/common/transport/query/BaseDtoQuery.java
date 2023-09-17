package org.traceo.common.transport.query;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.Order;

import java.io.Serializable;

@Setter @Getter
public class BaseDtoQuery implements Serializable {
    private String projectId;
    private Order order = Order.DESC;
    private Integer page = 1;
    private Integer take = 50;
    private String search;
    private String sortBy;
}
