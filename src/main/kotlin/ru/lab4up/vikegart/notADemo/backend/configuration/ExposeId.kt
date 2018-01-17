package ru.lab4up.vikegart.notADemo.backend.configuration

import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter
import org.springframework.stereotype.Component
import ru.lab4up.vikegart.notADemo.backend.model.Event


@Component
class ExposeEntityIdRestMvcConfiguration : RepositoryRestConfigurerAdapter() {

    override fun configureRepositoryRestConfiguration(config: RepositoryRestConfiguration) {
        config.exposeIdsFor(Event::class.java)
    }
}