class fetchObject {
    constructor(url) {
        this.url = url;
    }
    async get(page = "") {
        const data = await fetch(`${this.url}${page}`);
        return await data.json();
    }
    async delete(id) {
        await fetch(`${this.url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
        });
        return this.get();
    }
    async add(obj) {
        await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(obj),
        });
        return this.get();
    }
    async edit(id, obj) {
        await fetch(`${this.url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(obj),
        });
        return this.get();
    }
}

export default fetchObject;
