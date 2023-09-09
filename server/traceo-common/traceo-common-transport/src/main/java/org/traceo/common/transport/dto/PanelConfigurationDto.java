package org.traceo.common.transport.dto;

import lombok.Data;
import org.traceo.common.transport.enums.MetricUnit;
import org.traceo.common.transport.enums.VisualizationType;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class PanelConfigurationDto implements Serializable {
    private MetricUnit unit = MetricUnit.NONE;
    private VisualizationType visualization = VisualizationType.TIME_SERIES;
    private List<PanelSerieDto> series = new ArrayList<>();
    private HistogramDTO histogram;
    private StackDTO stack;
    private LineDTO line;
    private TooltipDTO tooltip;
    private LegendDTO legend;
    private AxisDTO axis;
    private TextDTO text;

    @Data
    public static class HistogramDTO {
        private BucketDTO bucket;
        private double min;
        private double max;
    }

    @Data
    public static class BucketDTO {
        private double size;
        private double offset;
    }

    @Data
    public static class StackDTO {
        private boolean show;
        private String strategy;
    }

    @Data
    public static class LineDTO {
        private MarkerDTO marker;
    }

    @Data
    public static class MarkerDTO {
        private boolean show;
        private String shape;
    }

    @Data
    public static class TooltipDTO {
        private boolean show;
        private String position;
    }

    @Data
    public static class LegendDTO {
        private boolean show;
        private String orient;
    }

    @Data
    public static class AxisDTO {
        private boolean showX;
        private boolean showY;
        private boolean showGridLines;
        private boolean showFloatLabels;
    }

    @Data
    public static class TextDTO {
        private Integer size;
        private Integer weight;
        private String color;
        private String value;
    }
}
