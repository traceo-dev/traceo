package org.traceo.core.kafka;

public record KafkaMessage(
        String topic,
        String payload,
        String key,
        int partition
) { }
