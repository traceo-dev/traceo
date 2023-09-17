package org.traceo.common.jpa.repositories;

import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.base.BaseRepository;
import org.traceo.common.jpa.entities.DatasourceEntity;

@Repository
public interface DatasourceRepository extends BaseRepository<DatasourceEntity> { }
