package org.traceo.core.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.traceo.core.kafka.constants.KafkaTopics;

/**
 * Kafka topic builders to better handling partitions/replicates.
 */

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic incidentsTopic() {
        return TopicBuilder
                .name(KafkaTopics.INCIDENT_TOPIC_EVENT)
                .build();
    }

    @Bean
    public NewTopic logsTopic() {
        return TopicBuilder
                .name(KafkaTopics.LOGS_TOPIC_EVENT)
                .build();
    }

    @Bean
    public NewTopic metricsTopic() {
        return TopicBuilder
                .name(KafkaTopics.METRICS_TOPIC_EVENT)
                .build();
    }

    @Bean
    public NewTopic tracingEvent() {
        return TopicBuilder
                .name(KafkaTopics.TRACING_TOPIC_EVENT)
                .build();
    }

    @Bean
    public NewTopic browserPerfsTopic() {
        return TopicBuilder
                .name(KafkaTopics.BROWSER_PERFS_TOPIC_EVENT)
                .build();
    }
}
