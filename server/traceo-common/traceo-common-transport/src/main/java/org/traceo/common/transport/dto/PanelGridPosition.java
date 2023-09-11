package org.traceo.common.transport.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter @Setter
public class PanelGridPosition implements Serializable {
    private String i;
    private int x;
    private int y;
    private int h;
    private int w;
}
