package ru.lab4up.vikegart.notADemo

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.concurrent.atomic.AtomicLong
import org.springframework.web.servlet.ModelAndView
import ru.lab4up.vikegart.notADemo.backend.model.Event
import ru.lab4up.vikegart.notADemo.backend.model.EventsList
import ru.lab4up.vikegart.notADemo.backend.model.Greeting


@RestController
class Controller {
    val counter = AtomicLong()

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun mainPage(): ModelAndView {
        return ModelAndView("forward://index.html")
    }

    @GetMapping("/greeting")
    fun greeting(@RequestParam(value = "name", defaultValue = "World") name: String): Greeting {
        return Greeting(counter.incrementAndGet(),"Hello, $name")
    }

    @GetMapping("/events")
    fun allEvents(): EventsList {
        var i:Long = 0
        val events = mutableListOf<Event>()
        while (i<5){
            events.add(Event(12+i,"название", "ссылка на картину", 0, "today", "now", "saratov"))
            i++
        }
        //TODO: сделать это сервисом и прикрутить базу данных
        return EventsList(events)
    }
}