export class Modal {
	constructor(dayId, type, uuid = "") {
		if (type == "show-modal") {
			this.modalElement = document.createElement("show-modal")
		} else if (type == "add-modal") {
			this.modalElement = document.createElement("add-modal")
		} else if (type == "edit-modal") {
			this.modalElement = document.createElement("edit-modal")
			this.modalElement.setAttribute("uuid", uuid)
		}
		this.modalElement.setAttribute("dayid", dayId)
	}

	showOn(body) {
		body.appendChild(this.modalElement)
		window.scrollTo(0, 0)
		body.classList.add("no-scroll")
	}
}
