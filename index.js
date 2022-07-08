const fs = require('fs');
const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
const PORT = 9000;

// const entriesArray = [
//     {
//         vorname: "Michaela",
//         nachname: "Werthmann",
//         email: "werthmannsupercode@gmail.com",
//         entry: "Hi, danke für die Aufnahme ins Gästebuch."
//     },
// ]

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
    console.log("new request", req.method, req.url);
    next();
})

app.use(express.static("public"));

app.get("/", (req, res) => {
    fs.readFile("entries.json", (err, data) => {
        if (err) {
            console.log("Die Datei konnte nicht gelesen werden")
            return
        }
        else {
            // console.log(data)
            const entriesArray = JSON.parse(data)

            // console.log(entriesArray)

            res.render("pages/home", { entriesArray })
        }
    })

})

app.post("/newEntry",
    body('vorname').isLength({ min: 2 }),
    body('nachname').isLength({ min: 2 }),
    body('email').isEmail(),
    body('entry').isLength({ min: 1 }),

    (req, res) => {
        const newEntry = req.body;
        console.log(newEntry)
        const string = JSON.stringify(newEntry)
        console.log(string)
        const errors = validationResult(req)
        console.log("validation errors:", errors)
        if (!errors.isEmpty()) {
            return res.status(400).render("pages/fehlerseite", { errors: errors.errors })
        }

        // entriesArray.push(newEntry)
        fs.readFile("entries.json", (err, data) => {
            if (err) {
                console.log("Die Datei konnte nicht gelesen werden")
                return
            }

            else {
                console.log(data)
                const dataString = data.toString()
                const sliceEndPoint = dataString.length - 1;
                console.log(sliceEndPoint)
                const newFileContent = `${dataString.slice(0, sliceEndPoint)}, ${string}]`
                console.log(newFileContent)
                fs.writeFile("entries.json", newFileContent, () => {
                    res.redirect("/")
                })
            }
        })

    })



app.listen(PORT, () => { console.log('listening on port' + PORT) })