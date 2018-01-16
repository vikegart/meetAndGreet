package ru.lab4up.vikegart.notADemo.backend.model.domain

import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import ru.lab4up.vikegart.notADemo.backend.model.Event

@RepositoryRestResource(collectionResourceRel = "events", path = "events")
interface EventRepository : PagingAndSortingRepository<Event, Long> {
    fun findBystartDate(@Param("startDate") startDate: String): List<Event>
}
