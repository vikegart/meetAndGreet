package ru.lab4up.vikegart.notADemo

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.ModelAndView


@RestController
class Controller {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun mainPage(): ModelAndView {
        return ModelAndView("forward://index.html")
    }
}