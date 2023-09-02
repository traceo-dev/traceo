package org.traceo.common.transport.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.traceo.common.transport.enums.MetricUnitEnum;

@Getter
@Setter
@NoArgsConstructor
public class PanelSerieDto {
    private String name;
    private String description;
    private MetricUnitEnum unit = MetricUnitEnum.NONE;
    private DatasourceDTO datasource = new DatasourceDTO();
    private ConfigDTO config = new ConfigDTO();

    @Getter
    @Setter
    public static class DatasourceDTO {
        private String field;
        private String query;
        private String formula;
    }

    @Getter
    @Setter
    public static class ConfigDTO {
        private Double lineWidth;
        private Double barWidth;
        private AreaDTO area;
        private String type;
        private String color;
    }

    @Getter
    @Setter
    public static class AreaDTO {
        private Boolean show;
        private Double opacity;
    }
}
