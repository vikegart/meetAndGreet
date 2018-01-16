package ru.lab4up.vikegart.notADemo.backend.model

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id


@Entity
class Event(
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long,
        val title: String="",
        val src: String="",
        val price: Long=0,
        val startDate: String="",
        val startTime: String="",
        val location: String="")