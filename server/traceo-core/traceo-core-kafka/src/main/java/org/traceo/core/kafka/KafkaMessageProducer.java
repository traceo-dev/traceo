package org.traceo.core.kafka;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaProducerException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

/**
 * Basic kafka message producer
 */

@Component
public class KafkaMessageProducer {
    private final static Logger logger = LoggerFactory.getLogger(KafkaMessageProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;

    protected KafkaMessageProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    private ProducerRecord<String, String> mapToRecord(KafkaMessage kafkaMessage) {
        return new ProducerRecord<>(
                kafkaMessage.topic(),
                kafkaMessage.partition(),
                kafkaMessage.key(),
                kafkaMessage.payload()
        );
    }

    public void send(KafkaMessage kafkaMessage) {
        send(mapToRecord(kafkaMessage), null);
    }

    public void send(KafkaMessage kafkaMessage, Consumer<SendResult<String, String>> onAccept) {
        send(mapToRecord(kafkaMessage), onAccept);
    }

    private void send(ProducerRecord<String, String> record, Consumer<SendResult<String, String>> onAccept) {
        kafkaTemplate
                .send(record)
                .thenAccept((res) -> {
                    if (onAccept != null) {
                        onAccept.accept(res);
                    }

                    String topic = res.getRecordMetadata().topic();
                    int partition = res.getRecordMetadata().partition();
                    long timestamp = res.getRecordMetadata().timestamp();

                    logger.info("New message has been sent to kafka broker, topic={}, partition={}, timestamp={}", topic, partition, timestamp);
                })
                .exceptionally(exc -> {
                    throw new KafkaProducerException(record, "Failed to send message to kafka broker.", exc);
                });
    }
}
