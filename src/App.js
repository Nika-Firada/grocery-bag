import { useState } from 'react';
import List from './List';
import Alert from './Alert';
import { useEffect } from 'react';

const getLocalStorage = () =>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else{
    return []
  }
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEdit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false, 
    msg:'', 
    type:''
  });

  const handleSubmit = e =>{
    e.preventDefault();
    if(!name){
      // display alert
      showAlert(true, 'danger', 'please enter value')
    }else if(name && isEdit){
      //deal with edit
      setList(list.map((item)=>{
        if(item.id === editID){
          return {...item,title:name}
        }
        return item
      }))
      setName('');
      setEditID(null);
      setIsEdit(false);
      showAlert(true,'success','value changed')
    }else{
      showAlert(true, 'success', 'item added to the list')
      const newItem = {id: new Date().getTime().toString(), title:name};
      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show=false,type='',msg='') => {
    setAlert({show,type,msg})
  }
  const clearList = ()=>{
    showAlert(true,'danger','empty list')
    setList('')
  }
  const removeItem = id =>{
    showAlert(true,'danger','item removed');
    setList(list.filter((item)=>item.id !== id))
  }
  const editItem = id =>{
    const special = list.find(item=>item.id === id)
    setIsEdit(true)
    setEditID(id)
    setName(special.title)
  }
  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list))
  },[list])
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className="form-control">
          <input type="text" className='grocery' placeholder='eggs' value={name} onChange={(e)=>setName(e.target.value)} />
          <button type='submit' className='submit-btn'>
            {isEdit? 'edit':'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 &&(
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button onClick={clearList} className='clear-btn'>Clear items</button>
        </div>
      )}
    </section>
  );
}

export default App;
