import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerts } from '../functions';

/*const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/app/employee')
    .then((response) => response.json())
    .then((data) => setData(data.items));
}, []);

{data?.map((employee) => (<li key={employee.id}>{employee.firstName}</li>))}*/

const ShowEmployees = () => {
    const url = '/api/app/employee';
    const [employees,setEmployees] = useState([]);
    const [id,setId] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [gender,setGender] = useState('');
    const [age,setAge] = useState('');
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState('');

    useEffect(() => {
        getEmployees();
    },[]);

    const getEmployees = async () => {
        const res = await axios.get(url);
        setEmployees(res.data.items);
        console.log(employees);
    }


    const openModal = (op, id, firstName, lastName, age, gender) => {
        setId('');
        setFirstName('');
        setLastName('');
        setAge('');
        setGender('');
        setOperation(op);
        if(op === 1){
            setTitle('New Employee');
        }
        else if(op === 2){
            setTitle('Edit Employee');
            setId(id);
            setFirstName(firstName);
            setLastName(lastName);
            setAge(age);
            setGender(gender);
        }
        window.setTimeout(function() {
            document.getElementById('firstName').focus();
        },500);
    }

    const valid = () => {
        var parameters;
        var method;

        if(firstName.trim() === ''){
            show_alerts('First name can not be empty', 'warning');
        }
        else if(lastName.trim() === ''){
            show_alerts('Last name can not be empty', 'warning');
        }
        else if(age === '' && age >= 18 && age <= 100 ){
            show_alerts('Age can not be empty and must be between 18 and 100', 'warning');
        }
        else if(gender === ''){
            show_alerts('Gender can not be empty', 'warning');
        }
        else{
            if(operation === 1){
                parameters = {firstName:firstName.trim(),lastName:lastName.trim(),age:parseInt(age),gender:parseInt(gender)}
                method = 'POST';
            }else{
                parameters = {id:id,firstName:firstName.trim(),lastName:lastName.trim(),age:parseInt(age),gender:parseInt(gender)}
                method = 'PUT';
            }

            sendOperation(method,parameters);
        }
    }

    const sendOperation = async(method,parameters) => {
        await axios({method:method, url: url, data: parameters, headers: 
            {
                'accept': 'text/plain', 
                'RequestVerificationToken': 'CfDJ8EbmT5lDxiVMkGN-fA1yJIL27Khz5pgwJA0581jNNWufwwLYe3_gbb9MKsArtQWON2OaFwnJkSO85MWUkGmAuGEbFN9BXOrALVfqFbtcagHFQwyR-FOjFjnd8YUfoYvHl1lRUzn7lB526ntNUX9heXI',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'

            }}).then(function(resp){
                if(resp.data.firstName !== ''){
                    var type = 'success';
                    var msj = 'Action Done';
                    show_alerts(msj,type);
                }
                if(type === 'success'){
                        document.getElementById('btnClose').click();
                        getEmployees();
                    }
                })
            .catch(function(error){
                show_alerts('Error on server side', 'error');
                console.log(error);
            })
    }

    const deleteEmployee = (id, firstName, lastName) => {
        const Alert = withReactContent(Swal);
        Alert.fire({
            title: 'Are you sure to deleete' + firstName + ' ' + lastName + '?',
            icon: 'question', text: 'Last chance',
            showCancelButton:true,confirmButtonText:'Yes',cancelButtonText:'Cancel'
        }).then((res) => {
            if(res.isConfirmed){
                setId(id);
                sendOperation('DELETE',{id:id});
            }
            else{
                show_alerts('Employee was not deleted','info')
            }
        })
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalEmployees'>
                            <i className='fa-solid fa-circle-plus'></i> Add
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                       
                            {(() => {
                                if (employees.length > 0) {
                                    return (
                                        <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-group-divider'>
                                            {employees.map((employee)=>(
                                                <tr key={employee.id}>
                                                    <td>{employee.firstName + ' ' + employee.lastName}</td>
                                                    <td>{employee.age}</td>
                                                    <td>{(() => {
                                                        if(employee.gender === 0){
                                                            return ('Male');
                                                        }
                                                        else if (employee.gender === 1){
                                                            return ('Female');
                                                        }
                                                        else{
                                                            return ('Other');
                                                        }
                                                    })()}</td>
                                                    <td>
                                                        <button onClick={() => openModal(2,employee.id,employee.firstName,employee.lastName,employee.age,employee.gender)} className='btn btn-warning'
                                                        data-bs-toggle='modal' data-bs-target='#modalEmployees'>
                                                            <i className='fa-solid fa-edit'></i>
                                                        </button>
                                                        &nbsp;
                                                        <button onClick={()=> deleteEmployee(employee.id,employee.firstName,employee.lastName)} className='btn btn-danger'>
                                                            <i className='fa-solid fa-trash'></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    )
                                }else {
                                    return(
                                        <h2>No Records</h2>
                                    )
                                }
                            })()}  
                    </div>
                </div>
            </div>
        </div>
        <div id='modalEmployees' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <input type='text' id='firstName' className='form-control' placeholder='First Name' value = {firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <input type='text' id='lastName' className='form-control' placeholder='Last Name' value = {lastName} onChange={(e) => setLastName(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <input type='number' min='18' max='100' id='age' className='form-control' placeholder='Age' value = {age} onChange={(e) => setAge(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <select id='gender' name='gender' className='form-control' placeholder='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option>Gender</option>
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                                <option value="2">Other</option>
                            </select>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => valid()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Save
                            </button>
                        </div>                    
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnClose' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                    </div>
                </div>
            </div>                        
        </div>
    </div>
  )
}

export default ShowEmployees