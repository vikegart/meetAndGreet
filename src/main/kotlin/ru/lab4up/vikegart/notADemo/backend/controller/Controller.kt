package ru.lab4up.vikegart.notADemo

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.concurrent.atomic.AtomicLong
import org.springframework.web.servlet.ModelAndView



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
}