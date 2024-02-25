
export class ReportModel {
    constructor(obj) {
        this.title = ""
        this.type = ""
        this.details = ""
        this.date = ""
        this.time = ""
        this.status = "Pending"
        this.user_id = 1
        this.today = (() => {
                        const date = new Date();
                        const dateToday = new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                            )
                            .toISOString()
                            .split("T")[0];
                        return dateToday;
                        })() // Self-invoking function. Function can return a value without being called.
        this.report_id = ""
        if(obj) {
            Object.assign(this, obj)
        }
    }
}

