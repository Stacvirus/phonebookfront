import axios from "axios";
const url = "/api/persons"

function getNotes(){
    const request = axios.get(url)
    return request.then(resp => resp.data)
}

function createNote(newNote){
    const rq = axios.post(url,newNote)
    return rq.then(resp => resp.data)
}

function DeleteNote(id){
    const rq = axios.delete(`${url}/${id}`)
}

function updateNote(id, newNote){
    const rq = axios.put(`${url}/${id}`, newNote)
    return rq.then(resp => resp.data)
}

export default {createNote, getNotes, DeleteNote, updateNote}

// "mongodb+srv://stacvirus:<password>@phonebookdb.gxpazuz.mongodb.net/"
// "2TDa5tq7YhCZeikT"
// phonebookV2:
// "mongodb+srv://parfaitandre5:<password>@phonebookv2.ztyamoo.mongodb.net/"
// "7gbk6fyS1IHPGYYb"