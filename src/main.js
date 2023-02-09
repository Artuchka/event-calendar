import { Calendar } from "./Classes/calendarClass"
import { Modal } from "./Classes/modalClass"

const calendarDayTemplate = document.querySelector("template#calendarDay")

const daysContainer = document.querySelector("[data-days-container]")

const nextMonthBtn = document.querySelector("[data-nextMonthBtn]")
const prevMonthBtn = document.querySelector("[data-prevMonthBtn]")
const todayBtn = document.querySelector("[data-todayBtn]")
const calendarSelected = document.querySelector("[data-calendarSelected]")

const currentCalendar = new Calendar()

updateCalendar()

prevMonthBtn.addEventListener("click", decreaseMonth)
nextMonthBtn.addEventListener("click", increaseMonth)
todayBtn.addEventListener("click", setCurrentDate)
daysContainer.addEventListener("click", (e) => {
	showEvents(e)
})
daysContainer.addEventListener("click", (e) => {
	addEvents(e)
})

export function updateCalendar() {
	populateMonth(currentCalendar.datesForMonth)
	populateEvents(currentCalendar.eventsForMonth)
}

function populateMonth(dates) {
	daysContainer.textContent = ""
	const currentDay = currentCalendar.nowDate
	dates.forEach(({ dayOfMonth, dayOfWeek, isCurrent, dayId }) => {
		const day = calendarDayTemplate.content.cloneNode(true)
		if (dayOfWeek) {
			day.querySelector("[data-dayOfWeek]").textContent = dayOfWeek
		}
		day.querySelector("[data-dayOfMonth]").textContent = dayOfMonth
		const parent = day.querySelector("[data-calendarDate]")
		parent.setAttribute("data-calendarDate", dayId.toString())

		if (isCurrent) {
			parent.classList.add("current")
		}
		if (currentDay == dayId) {
			parent.classList.add("current-day")
		}
		daysContainer.appendChild(day)
	})
	updateSelectedText()
}

function populateEvents(eventsForMonth) {
	eventsForMonth.forEach(({ dayId, eventsForDay }) => {
		if (eventsForDay == []) return
		const day = document.querySelector(`[data-calendarDate='${dayId}']`)

		const eventsContainer = day.querySelector("[data-eventsList]")
		eventsContainer.innerHTML = ""
		eventsContainer.setAttribute("dayid", dayId)
		eventsForDay.slice(0, 5).forEach((event) => {
			const liElement = document.createElement("li")
			let eventElement
			if (event.isAllDay) {
				eventElement = document.createElement("event-all-day")
			} else {
				eventElement = document.createElement("event-certain")
			}
			eventElement.setAttribute("info", event.name)
			eventElement.setAttribute("color", event.color)
			eventElement.setAttribute("data-timeStart", event.timeStart)
			eventElement.setAttribute("data-timeEnd", event.timeEnd)
			eventElement.setAttribute("uuid", event.uuid)

			liElement.append(eventElement)

			eventsContainer.appendChild(liElement)
		})

		if (eventsForDay.length > 5) {
			const lookMoreElement = day.querySelector("[data-amountLeft]")
			lookMoreElement.textContent = eventsForDay.length - 5

			const lookMoreBtn = lookMoreElement.parentNode
			lookMoreBtn.classList.remove("hidden")
		}
	})
}
function decreaseMonth() {
	currentCalendar.decreaseMonth()
	updateCalendar()
}

function increaseMonth() {
	currentCalendar.increaseMonth()
	updateCalendar()
}

function setCurrentDate() {
	currentCalendar.setCurrentDate()
	updateCalendar()
}

function updateSelectedText() {
	calendarSelected.textContent = currentCalendar.monthWithDay
}

function showEvents(e) {
	e.stopPropagation()

	if (!e.target.matches("[data-calendardate]")) return

	console.log(e.target)
	const dayId = e.target.getAttribute("data-calendardate")

	const modal = new Modal(dayId, "show-modal")
	modal.showOn(document.querySelector("body"))
}

function addEvents(e) {
	e.stopImmediatePropagation()

	if (!e.target.matches("[data-addEventBtn]")) return

	console.log(e.target)
	const dayId = e.target.parentNode.getAttribute("data-calendardate")

	const modal = new Modal(dayId, "add-modal")
	modal.showOn(document.querySelector("body"))
}
