import axios from "axios";

// handle all http request

const baseUrl = "http://localhost:50096/api/";

export default {
    items(url = baseUrl + "Items/") {
        return {
            // req for graph data for item with #id
            fetchGraph: id => axios.get(url + "graph/" + id), 
            // req for item recommendation value
            fetchRec: id => axios.get(url + "rec/" + id),
        }
    }
}