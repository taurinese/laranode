module.exports = class Router {

    get(url, callback) {
        console.log(arguments)
        if(arguments[1].arguments[0] == url && arguments[1].arguments[1] === "GET"){
            console.log('test');
        }
    }

    /* post = () => {

    }

    put = () => {

    }

    delete = () => {

    } */
}

 

