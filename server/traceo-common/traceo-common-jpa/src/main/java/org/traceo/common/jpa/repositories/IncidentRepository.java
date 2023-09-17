package org.traceo.common.jpa.repositories;

import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.base.BaseRepository;
import org.traceo.common.jpa.entities.IncidentEntity;

@Repository
public interface IncidentRepository extends BaseRepository<IncidentEntity> { }
