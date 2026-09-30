import app from "./app.js";

function init(){

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}

init();