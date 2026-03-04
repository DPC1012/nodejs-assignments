// start creating server here
import http from "http"
let todos = [];
let id = 1;
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Hello World");
    }
    else if (req.method === "POST" && url.pathname === "/create/todo") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        })

        req.on("end", () => {
            const { title, description } = JSON.parse(body);
            const newTodo = {
                id: id,
                title: title,
                description: description
            }
            todos.push(newTodo);
            id++;
            res.writeHead(200, { "content-type": "application/json" });
            return res.end(JSON.stringify(todos));
        })
    }
    else if (req.method === "GET" && url.pathname === "/todos") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(todos));
    }
    else if (req.method === "GET" && url.pathname === "/todo") {
        const id = Number(url.searchParams.get("id"));
        const findTodo = todos.find((t) => t.id === id);
        if (!findTodo) {
            res.writeHead(404, { "content-type": "application/json" });
            return res.end(JSON.stringify({ "error": "Todo not found" }))
        }
        else {
            res.writeHead(200, { "content-type": "application/json" });
            return res.end(JSON.stringify(findTodo))
        }
    }
    else if (req.method === "DELETE" && url.pathname === "/todo") {
        const id = Number(url.searchParams.get("id"));
        const findIndex = todos.findIndex((t) => t.id === id);
        if (findIndex === -1) {
            res.writeHead(404, { "content-type": "application/json" });
            return res.end(JSON.stringify({ "error": "Todo not found" }))
        }
        else {
            todos.splice(findIndex, 1);
            res.writeHead(200, { "content-type": "application/json" });
            res.end()
        }
    }
    else {
        res.writeHead(404);
        res.end();
    }
})

server.listen(3000)