package ru.lab4up.vikegart.notADemo.backend.model

class Event(
        val id: Long,
        val title: String,
        val src: String,
        val price: Long,
        val startDate: String,
        val startTime: String,
        val location: String)