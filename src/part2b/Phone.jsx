import { useState, useEffect } from 'react'
import styles from "./phone.module.css"
import serverData from "./Notes"
import Notify from './notification'

function findMatches(word, list){
    const regex = new RegExp(word, "gi")
    let ans = list.filter(res => res.name.match(regex)) 
    return ans
}

function Search(props){
    const [sval, setVal] = useState()
    function handleInSearch(e){
        const {value} = e.target
        setVal(value)
        return props.handleSearch(value)
    }
    return(
        <p>search: <input type="search" onChange={handleInSearch} value={sval}/></p>
    )
}

function Form(props) {
    const [val, setVal] = useState({ name: "", value: "" })
    function handleInForm(e) {
        e.preventDefault()
        props.handlesub("bonjour")
    }

    function handleInputCom(e) {
        const { value, name } = e.target
        const object = {
            ...val,
            name: name,
            value: value
        }
        setVal(object)
        return props.handleval(value, name)
    }

    return (
        <form onSubmit={handleInForm}>
            <div>
                name: <input onChange={handleInputCom} name="name" />
                number: <input type="text" onChange={handleInputCom} name="number" />
            </div>
            <button type="submit">add</button>
        </form>
    )
}

function Book() {
    const [persons, setPersons] = useState(null)
    const [newPersons, setNewPersons] = useState({ name: "", number: "" })
    const [result, setResult] = useState([])
    const [notifyOptions, setNotifyOptions] = useState({name: "", clr: ""})

    useEffect(() =>{
            serverData.getNotes()
                .then(resp => {
                    setPersons(resp)
                    console.log(resp)
                })
    }, [])

    function handleSearch(value) {
        if(!value){
            setResult([])
            return
        }
        const ans = findMatches(value, persons)
        console.log(ans)
        setResult(ans)
        // const names = persons.map(person => person.name).filter(res => {
        //     const cap = value[0].toUpperCase() + value.slice(1)
        //     return res.includes(cap)
        // })
        // let nameObject = []
        // names.forEach(surname => {
        //     const subObject = {
        //         person: surname
        //     } 
        //     nameObject.push(subObject)           
        // });
        // setResult(nameObject)
        // console.log(result)
    }

    function handleForm(e) {
        console.log(e)
        const object = {
            name: newPersons.name,
            number: newPersons.number
        }
        const isExist = persons.map(person => person.name).filter(perName => perName === object.name && true)
        isExist != object.name ? ServerData(object) : numberVerification(object)
        // setNewPersons({ name: "", number: "" })
        
    }

    function numberVerification(object){
        const exitId = persons.filter(person => person.name == object.name)
        if(object.number != exitId[0].number && confirm(`${object.name} is already added to the phone book, replace the old number with a new one?`)){
            serverData.updateNote(exitId[0].id, object)
                .then(resp => setPersons(persons.map(person => person.id != exitId[0].id ? person : resp)))
                .catch(error => {
                    console.log('failed to update note', error)
                    setNotifyOptions({name: object.name, clr: "red"})
                })
        }else{
            alert(`${object.name} already exist in the list`)            
        }
    }

    function ServerData(newObject){ 
        serverData.createNote(newObject)
            .then(resp => {
                console.log(resp)
                setPersons(persons.concat(resp))
                setNotifyOptions({name: resp.name, clr: "green"})
                setTimeout(() => {
                    setNotifyOptions({...notifyOptions, name: undefined})
                }, 3000);
            }) 
            .catch(error =>{
                console.log(error)
                setNotifyOptions({name: error.response.data.error, clr: "red"})
                setTimeout(() => {
                    setNotifyOptions({...notifyOptions, name: undefined})
                }, 3000);
            })             
    }

    function handleInput(value, name) {
        setNewPersons(prevalues => ({ ...prevalues, [name]: value }))
        // console.log(value)
    }

    function handleDelete(id){
        function Delete(){            
            serverData.DeleteNote(id)
            setPersons(persons.filter(person => person.id != id))
        }
        return Delete
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notify options={notifyOptions}/>
            <Search handleSearch={handleSearch}/>
            <Form handlesub={handleForm} handleval={handleInput} />
            

            <h2>Numbers</h2>
            {persons && persons.map((person) => <p key={person.id}>{person.name} {person.number} <button onClick={handleDelete(person.id)}>Delete</button></p>)}
            <h2>Search Results</h2>
            {result.map((res, id) => <p key={id}>{res.name}</p>)}
        </div>
    )
}

export default Book;