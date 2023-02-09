const {
	getDate,
	addDays,
	isLastDayOfMonth,
	startOfWeek,
	startOfISOWeek,
	getDay,
	format,
	max,
	min,
	isSameDay,
	endOfWeek,
	lastDayOfMonth,
	isSameMonth,
	addMonths,
	getUnixTime,
	startOfDay,
} = require("date-fns")

import { getItemByStamp } from "../storage"

export class Calendar {
	constructor(date = new Date()) {
		this.date = date
	}

	static set date(value) {
		this.date = value
	}

	static get date() {
		return this.date
	}

	static getDayOfWeek(date) {
		return format(date, "iii")
	}

	static getDayOfMonth(date) {
		return getDate(date)
	}

	static getStartOfWeek(date) {
		return startOfWeek(date, { weekStartsOn: 1 })
	}

	static getEndOfWeek(date) {
		return endOfWeek(date, { weekStartsOn: 1 })
	}

	static getDayId(date) {
		return getUnixTime(startOfDay(date))
	}

	isCurrentMonth(date) {
		return isSameMonth(this.date, date)
	}

	get nowDate() {
		return getUnixTime(startOfDay(new Date()))
	}

	get dayOfMonth() {
		return getDate(this.date)
	}

	get firstDayOfMonth() {
		return addDays(this.date, -this.dayOfMonth + 1)
	}
	get lastDayOfMonth() {
		return lastDayOfMonth(this.date)
	}

	get startOfWeek() {
		return startOfWeek(this.date, { weekStartsOn: 1 })
	}

	get monthWithDay() {
		return format(this.date, "MMMM y")
	}

	get datesForMonth() {
		const dates = []
		let tempDate = Calendar.getStartOfWeek(this.firstDayOfMonth)
		const lastDate = Calendar.getEndOfWeek(this.lastDayOfMonth)
		let dayAmount = 0

		while (!isSameDay(tempDate, lastDate)) {
			dates.push({
				dayOfWeek:
					dayAmount >= 7 ? "" : Calendar.getDayOfWeek(tempDate),
				dayOfMonth: Calendar.getDayOfMonth(tempDate),
				isCurrent: this.isCurrentMonth(tempDate),
				dayId: Calendar.getDayId(tempDate),
			})
			tempDate = addDays(tempDate, 1)
			dayAmount++
		}
		dates.push({
			dayOfWeek: Calendar.getDayOfWeek(tempDate),
			dayOfMonth: Calendar.getDayOfMonth(tempDate),
			isCurrent: this.isCurrentMonth(tempDate),
			dayId: Calendar.getDayId(tempDate),
		})
		return dates
	}

	get eventsForMonth() {
		const events = []
		let tempDate = Calendar.getStartOfWeek(this.firstDayOfMonth)
		const lastDate = Calendar.getEndOfWeek(this.lastDayOfMonth)
		let dayAmount = 0

		while (!isSameDay(tempDate, lastDate)) {
			const dayId = Calendar.getDayId(tempDate)
			const eventDetails = getItemByStamp(dayId) ?? []
			events.push({
				dayId: dayId,
				eventsForDay: eventDetails,
			})
			tempDate = addDays(tempDate, 1)
			dayAmount++
		}

		const dayId = Calendar.getDayId(tempDate)
		const eventDetails = getItemByStamp(dayId) ?? []
		events.push({
			dayId: dayId,
			eventsForDay: eventDetails,
		})
		return events
	}

	addDays(amount) {
		this.date = addDays(this.date, amount)
	}

	subtractDays(amount) {
		this.date = addDays(this.date, -amount)
	}

	decreaseMonth() {
		this.date = addMonths(this.date, -1)
	}

	increaseMonth() {
		this.date = addMonths(this.date, 1)
	}
	setCurrentDate() {
		this.date = new Date()
	}

	addEvent(eventInfo) {
		Calendar.addToLocalStorage(eventInfo)
	}
}
