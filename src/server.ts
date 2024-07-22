import app from "./app";
import { SERVER_PORT } from "./config/config";
const PORT = SERVER_PORT;


app.listen(PORT, () =>
    console.log(`Wager system listening on port 🔥🔥 ${PORT}!`)
);