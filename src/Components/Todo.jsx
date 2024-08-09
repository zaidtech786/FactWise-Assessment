import React, { useContext, useEffect, useState } from 'react';
import celebsData from "../../Instructions/celebrities.json";
import SearchIcon from '@mui/icons-material/Search';
import "../Css/Todo.css"
import DisplayTodo from './DisplayTodo';


const Todo = () => {
    const [userInput,setUserInput] = useState("")
    const [data,setData] = useState(celebsData)    
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleAccordion = (id) => {
      // Prevent toggling if editing is active
      if (!isEditing) {
        setActiveAccordion(activeAccordion === id ? null : id);
      }
    };

  return (
    <div className='container'>
      <h1>List View</h1>
      <div className='inputBox'>
        <input type="text" placeholder='search user...' value={userInput}  onChange={(e) => setUserInput(e.target.value)} className='input' />
        <SearchIcon className = "searchIcon" />
      </div>
        {
           data && data.length > 0 &&
          data.filter( (user) => {
            if(userInput == " "){
              return user;
            } 
            else if(user.first.toLowerCase().includes(userInput.toLowerCase()) || user.last.toLowerCase().includes(userInput.toLowerCase())){
              return user;
            }
          }).map( (user) => {
              return <DisplayTodo   
                key={user.id}
                data={data}
                setData = {setData}
                user={user}
                isOpen={activeAccordion === user.id}
                onToggle={() => handleAccordion(user.id)}
                isEditing={isEditing}
                setIsEditing={setIsEditing}/>
            })
        }
    </div>
  )

}

export default Todo