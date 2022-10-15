import { fromUnixTime } from "date-fns"
import format from "date-fns/format"
import {
	addItemByStamp,
	deleteEventByStampAndUuid,
	getItemByStamp,
	getItemByStampAndUuid,
	updateEventByStamp,
} from "../../storage"
import { v4 as uuidv4 } from "uuid"
import { updateCalendar } from "../../main"

const templateShow = document.createElement("template")
const templateAdd = document.createElement("template")
const templateEdit = document.createElement("template")

templateShow.innerHTML = `
<style>

@keyframes fade-in {
    from {
        scale: 0;
        opacity: 0;
    }

    to {
        scale: 1;
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        scale: 1;
        opacity: 1;
    }

    to {
        scale: 0;
        opacity: 0;
    }
}
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.modal {
    animation: fade-in .3s;
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: #fff;
	translate: -50% -50%;
	padding: 2rem;
	border-radius: .5em;
	z-index: 2;
	max-width: 400px;
	min-width: 200px;
	width: 100%;
}

.modalbg {
	position: absolute;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.524);
	z-index: 1;
}

.header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.header .title {
	font-size: 1.5rem;
}

.header .date {
	font-size: 1.2rem;
	color: gray;
}

.eventList {
	display: flex;
	flex-direction: column;
	list-style-type: none;
	gap: 0.5rem;
}

</style>
<div class="modal showModal">
<div class="header">
	<div class="title" data-title>
		Show Modal
	</div>
	<div class="date" data-date>
		123
	</div>
</div>
<ul class="eventList" data-eventList>
</ul>
</div>
<div class="modalbg" data-modalBg>
</div>
`
templateAdd.innerHTML = `
<style>

@keyframes fade-in {
    from {
        scale: 0;
        opacity: 0;
    }

    to {
        scale: 1;
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        scale: 1;
        opacity: 1;
    }

    to {
        scale: 0;
        opacity: 0;
    }
}
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .modal {

    animation: fade-in .3s;
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: #fff;
            translate: -50% -50%;
            padding: 2rem;
            border-radius: .5em;
            z-index: 2;
            max-width: 400px;
            min-width: 200px;
            width: 100%;
        }

        .modalbg {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.524);
            z-index: 1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }

        .header .title {
            font-size: 1.5rem;
        }

        .header .date {
            font-size: 1.2rem;
            color: gray;
        }



        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .time-range {
            display: flex;
            gap: 1rem;
        }

        .time-range.disabled {
            opacity: 0.6;
            background-color: lightgray;
        }

        .time-range>* {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            flex-grow: 1;
        }


        .time-range input {
            font-size: .9rem;
            padding: 0.5em;
            border: 1px solid gray;
        }

        .colors {
            display: flex;
            gap: 0.1rem;
        }

        .colors .color {
            width: 30px;
            height: 30px;
            border-radius: .3em;
            opacity: 0.5;
        }

        .colors input {
            display: none;
        }

        .colors input:checked+label {
            opacity: 1;
        }


        .color.color-blue {
            background-color: lightblue;
        }

        .color.color-red {
            background-color: lightcoral;
        }

        .color.color-green {
            background-color: lightgreen;
        }

        button[type="submit"] {
            cursor: pointer;
            padding: 0.5em;
            background-color: rgba(144, 238, 144, 0.425);
            border: 1px solid green;
            color: green;
            border-radius: .3em;
            font-size: 1rem;
        }

        .name {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 0.1rem;
        }

        .name input {
            font-size: 1rem;
            padding: 0.5em;
            border: 1px solid gray;
        }
    </style>
    <div class="modal showModal">
        <div class="header">
            <div class="title" data-title>
                Show Modal
            </div>
            <div class="date" data-date>
                123
            </div>
        </div>
        <form>
            <div class="name">
                <label for="name">Name</label>
                <input type="text" id="name" data-name list="namesList">

                <datalist id="namesList">
                    <option value="event"></option>
                    <option value="eventik"></option>
                    <option value="bday"></option>
                    <option value="birthday"></option>
                    <option value="BD"></option>
                    <option value="New Year"></option>
                    <option value="Eve"></option>
                    <option value="Russia Day"></option>
                    <option value="Meeting"></option>
                    <option value="Work Meeting"></option>
                </datalist>
            </div>
            <div class="is-all-day">
                <input type="checkbox" name="" id="is-all-day" data-allDay>
                <label for="is-all-day">All Day?</label>
            </div>
            <div class="time-range" data-timeRange>
                <div class="start-time">
                    <label for="start-time">Start Time</label>
                    <input type="time" name="" id="start-time" min="00:00" max="23:59" data-startTime>
                </div>
                <div class="end-time">
                    <label for="end-time">End Time</label>
                    <input type="time" min="00:01" max="23:59" id="end-time" data-endTime>
                </div>
            </div>
            <span>Color</span>
            <div class="colors">
                <input type="radio" name="colors" id="color-1" checked>
                <label for="color-1" class="color color-blue"></label>

                <input type="radio" name="colors" id="color-2">
                <label for="color-2" class="color color-red"></label>

                <input type="radio" name="colors" id="color-3">
                <label for="color-3" class="color color-green"></label>
            </div>
            <button type="submit">Add</button>
        </form>
    </div>
    <div class="modalbg" data-modalBg>
    </div>
`
templateEdit.innerHTML = `
<style>

@keyframes fade-in {
    from {
        scale: 0;
        opacity: 0;
    }

    to {
        scale: 1;
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        scale: 1;
        opacity: 1;
    }

    to {
        scale: 0;
        opacity: 0;
    }
}
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .modal {

    animation: fade-in .3s;
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: #fff;
            translate: -50% -50%;
            padding: 2rem;
            border-radius: .5em;
            z-index: 2;
            max-width: 400px;
            min-width: 200px;
            width: 100%;
        }

        .modalbg {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.524);
            z-index: 1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }

        .header .title {
            font-size: 1.5rem;
        }

        .header .date {
            font-size: 1.2rem;
            color: gray;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .time-range {
            display: flex;
            gap: 1rem;
        }

        .time-range.disabled {
            opacity: 0.6;
            background-color: lightgray;
        }

        .time-range>* {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            flex-grow: 1;
        }


        .time-range input {
            font-size: .9rem;
            padding: 0.5em;
            border: 1px solid gray;
        }

        .colors {
            display: flex;
            gap: 0.1rem;
        }

        .colors .color {
            width: 30px;
            height: 30px;
            border-radius: .3em;
            opacity: 0.5;
        }

        .colors input {
            display: none;
        }

        .colors input:checked+label {
            opacity: 1;
        }


        .color.color-blue {
            background-color: lightblue;
        }

        .color.color-red {
            background-color: lightcoral;
        }

        .color.color-green {
            background-color: lightgreen;
        }

        .buttons {
            display: flex;
            width: 100%;
            gap: 1rem;
        }

        .buttons>* {
            flex-grow: 1;
        }

        .btn {
            cursor: pointer;
            padding: 0.5em;
            border: 1px solid gray;
            border-radius: .3em;
            font-size: 1rem;
        }

        .btn--success {
            border-color: green;
            color: green;
            background-color: rgba(144, 238, 144, 0.425);
        }

        .btn--error {
            border-color: red;
            color: red;
            background-color: rgba(238, 144, 144, 0.425);
        }

        .name {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 0.1rem;
        }

        .name input {
            font-size: 1rem;
            padding: 0.5em;
            border: 1px solid gray;
        }
    </style>
    <div class="modal showModal">
        <div class="header">
            <div class="title" data-title>
                Show Modal
            </div>
            <div class="date" data-date>
                123
            </div>
        </div>
        <form>
            <div class="name">
                <label for="name">Name</label>
                <input type="text" id="name" data-name list="namesList">


                <datalist id="namesList">
                    <option value="event"></option>
                    <option value="eventik"></option>
                    <option value="bday"></option>
                    <option value="birthday"></option>
                    <option value="BD"></option>
                    <option value="New Year"></option>
                    <option value="Eve"></option>
                    <option value="Russia Day"></option>
                    <option value="Meeting"></option>
                    <option value="Work Meeting"></option>
                </datalist>
            </div>
            <div class="is-all-day">
                <input type="checkbox" name="" id="is-all-day" data-allDay>
                <label for="is-all-day">All Day?</label>
            </div>
            <div class="time-range" data-timeRange>
                <div class="start-time">
                    <label for="start-time">Start Time</label>
                    <input type="time" name="" id="start-time" min="00:00" max="23:59" data-startTime>
                </div>
                <div class="end-time">
                    <label for="end-time">End Time</label>
                    <input type="time" min="00:01" max="23:59" id="end-time" data-endTime>
                </div>
            </div>
            <div class="colors">
                <input type="radio" name="colors" id="color-1" checked>
                <label for="color-1" class="color color-blue"></label>

                <input type="radio" name="colors" id="color-2">
                <label for="color-2" class="color color-red"></label>

                <input type="radio" name="colors" id="color-3">
                <label for="color-3" class="color color-green"></label>
            </div>
            <div class="buttons">
                <button type="submit" class="btn btn--success">Update</button>
                <button type="submit" class="btn btn--error" deleteBtn>Delete</button>
            </div>
        </form>
    </div>
    <div class="modalbg" data-modalBg>
    </div>
`

class ModalParent extends HTMLElement {
	constructor(type) {
		super()

		this.attachShadow({ mode: "open" })
		if (type == "show-modal") {
			const showClone = document.importNode(templateShow.content, true)
			this.shadowRoot.appendChild(showClone)

			this.titleText = "Events on"
		} else if (type == "add-modal") {
			const addClone = document.importNode(templateAdd.content, true)
			this.shadowRoot.appendChild(addClone)

			this.titleText = "Add event on"
		} else if (type == "edit-modal") {
			const addClone = document.importNode(templateEdit.content, true)
			this.shadowRoot.appendChild(addClone)

			this.titleText = "Edit event on"
		}

		this.dateElement = this.shadowRoot.querySelector(" [data-date]")
		this.titleElement = this.shadowRoot.querySelector(" [data-title]")
	}

	connectedCallback() {
		this.shadowRoot
			.querySelector("[data-modalBg]")
			.addEventListener("click", (e) => {
				// this.doAnimations()
				this.shadowRoot.querySelector(".modal").style.animation =
					"fade-out 310ms"

				setTimeout(() => {
					this.remove()
				}, 300)
			})

		this.titleElement.textContent = this.titleText

		this.unixDate = this.getAttribute("dayId")
		const date = fromUnixTime(this.unixDate)
		this.dateElement.textContent = format(date, "d/M/y")
	}

	disconnectedCallback() {
		document.querySelector("body").classList.remove("no-scroll")
		updateCalendar()
	}
}

class ShowModal extends ModalParent {
	constructor() {
		super("show-modal")
	}

	disconnectedCallback() {}

	connectedCallback() {
		super.connectedCallback()

		this.eventList = this.shadowRoot.querySelector("[data-eventList]")

		this.eventList.setAttribute("dayid", this.getAttribute("dayid"))

		this.loadEvents()
	}

	loadEvents() {
		const events = getItemByStamp(this.unixDate)
		if (!events) return

		events.forEach((event) => {
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
			eventElement.setAttribute("uuid", event.uuid)

			liElement.append(eventElement)

			this.eventList.appendChild(liElement)
		})
	}
}

class DataModal extends ModalParent {
	constructor(type) {
		super(type)
		this.type = type
	}

	connectedCallback() {
		super.connectedCallback()

		this.form = this.shadowRoot.querySelector("form")

		this.nameElement = this.form.querySelector("[data-name]")
		const timeRangeElement = this.form.querySelector("[data-timeRange]")

		this.timeStartElement =
			timeRangeElement.querySelector("[data-startTime]")

		this.timeEndElement = timeRangeElement.querySelector("[data-endTime]")

		this.isAllDayElement = this.form.querySelector("[data-allDay]")

		this.colorElements = Array.from(
			this.shadowRoot.querySelectorAll("input[type='radio']")
		)
		this.isAllDayElement.addEventListener("input", (e) => {
			if (e.target.checked) {
				timeRangeElement.classList.add("disabled")
				this.timeStartElement.disabled = true
				this.timeEndElement.disabled = true
			} else {
				timeRangeElement.classList.remove("disabled")
				this.timeStartElement.disabled = false
				this.timeEndElement.disabled = false
			}
		})
		this.formSubmit()
	}

	formSubmit() {
		this.form.addEventListener("submit", (e) => {
			e.preventDefault()
			const eventDetails = this.getDetails()
			if (eventDetails == "fuck you") {
				alert("fuck you")
				return
			}
			addItemByStamp(this.unixDate, eventDetails)
			this.remove()
		})
	}

	getDetails() {
		let uuid
		if (this.type == "edit-modal") {
			uuid = this.getAttribute("uuid")
		} else if (this.type == "add-modal") {
			uuid = uuidv4()
		}

		const name = this.nameElement.value
		if (name == "") return "fuck you"
		const timeStart = this.timeStartElement.value
		const timeEnd = this.timeEndElement.value
		const isAllDay = this.isAllDayElement.checked

		const colorId = this.colorElements.filter((inp) => inp.checked)[0].id
		let color
		switch (colorId) {
			case "color-1":
				color = "lightblue"
				break
			case "color-2":
				color = "lightcoral"
				break
			case "color-3":
				color = "lightgreen"
				break
		}
		return {
			uuid,
			name,
			timeStart,
			timeEnd,
			color,
			isAllDay,
		}
	}
}

class AddModal extends DataModal {
	constructor() {
		super("add-modal")
	}
}
class EditModal extends DataModal {
	constructor() {
		super("edit-modal")
	}

	connectedCallback() {
		super.connectedCallback()

		this.uuid = this.getAttribute("uuid")

		const eventDetails = getItemByStampAndUuid(this.unixDate, this.uuid)

		this.nameElement.value = eventDetails.name
		this.timeStartElement.value = eventDetails.timeStart
		this.timeEndElement.value = eventDetails.timeEnd
		this.isAllDayElement.checked = eventDetails.isAllDay

		let colorId = "color"
		switch (eventDetails.color) {
			case "lightblue":
				colorId = "color-1"
				break
			case "lightcoral":
				colorId = "color-2"
				break
			case "lightgreen":
				colorId = "color-3"
				break
		}
		this.colorElements.forEach((colorElement) => {
			console.log(colorElement.id, colorId)
			if (colorElement.id == colorId) {
				colorElement.checked = true
			}
		})
	}

	formSubmit() {
		this.form.addEventListener("submit", (e) => {
			e.preventDefault()

			if (e.submitter.matches("[deleteBtn]")) {
				deleteEventByStampAndUuid(
					this.unixDate,
					this.getAttribute("uuid")
				)
				this.remove()

				return
			}

			const eventDetails = this.getDetails()
			if (eventDetails == "fuck you") {
				alert("fuck you")
				return
			}
			updateEventByStamp(this.unixDate, eventDetails)
			this.remove()
		})
	}
}

customElements.define("show-modal", ShowModal)
customElements.define("add-modal", AddModal)
customElements.define("edit-modal", EditModal)
