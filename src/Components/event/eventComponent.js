import { Modal } from "../../Classes/modalClass"

// const templateAllDay = document.querySelector("template#eventAllDay")
// const templateCertain = document.querySelector("template#eventCertain")

const templateAllDay = document.createElement("template")
const templateCertain = document.createElement("template")

templateAllDay.innerHTML = `
<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .event {
            --bgColor: blue;
            background-color: var(--bgColor);
            color: white;
            border-radius: .15rem;
            padding: 0.4rem;
            width: 100%;
            text-align: center;
            /* text-align: left; */
            /* text-indent: .3rem; */
        }
    </style>
    <div class="event">
        <span class="info" data-info>
            info is here
        </span>
    </div>
`

templateCertain.innerHTML = `
<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.event {
		--bgColor: blue;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.event .circle {
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background-color: var(--bgColor, red);
	}

	.event .time {
		color: gray;
	}
</style>
<div class="event">
	<div class="circle"></div>
	<time class="time" data-time>

	</time>
	<span class="info" data-info>

	</span>
</div>
`

class Event extends HTMLElement {
	constructor(type) {
		super()
		this.attachShadow({ mode: "open" })

		let clone
		if (type == "event-all-day") {
			clone = document.importNode(templateAllDay.content, true)
		} else if (type == "event-certain") {
			clone = document.importNode(templateCertain.content, true)
		}

		this.shadowRoot.appendChild(clone)
	}

	connectedCallback() {
		this.infoElement = this.shadowRoot.querySelector("[data-info]")

		this.infoElement.textContent = this.getAttribute("info")
		this.shadowRoot
			.querySelector(".event")
			.style.setProperty("--bgColor", this.getAttribute("color"))

		this.addEventListener("click", (e) => {
			this.editEvent(e)
		})
	}

	editEvent(e) {
		e.stopImmediatePropagation()

		const dayId = e.target.parentNode.parentNode.getAttribute("dayid")
		const uuid = e.target.getAttribute("uuid")

		const modal = new Modal(dayId, "edit-modal", uuid)
		modal.showOn(document.querySelector("body"))
	}
}

class eventAllDay extends Event {
	constructor() {
		super("event-all-day")
	}

	connectedCallback() {
		super.connectedCallback()
	}
}
class eventCertain extends Event {
	constructor() {
		super("event-certain")
	}

	connectedCallback() {
		super.connectedCallback()

		const timeStart = this.getAttribute("data-timeStart")
		const timeEnd = this.getAttribute("data-timeEnd")
		this.shadowRoot.querySelector(
			"[data-time]"
		).textContent = `${timeStart}`
	}
}

customElements.define("event-all-day", eventAllDay)
customElements.define("event-certain", eventCertain)
